import { hashPassword } from "../utils/auth.js";
import {
  createDevEmployee,
  deleteDevEmployee,
  listDevEmployees,
  updateDevEmployee,
} from "../utils/seed.js";
import { isDbReady } from "../utils/dbState.js";
import { AppError } from "../middleware/errorHandler.js";
import {
  createUser,
  deleteEmployee,
  findEmployeeById,
  findUserByEmailInBusiness,
  listEmployeesByBusiness,
  updateEmployee,
} from "../repositories/userRepository.js";

function formatEmployee(employee) {
  return {
    id: employee.id,
    name: employee.name,
    email: employee.email,
    role: employee.role,
    active: employee.active,
  };
}

export async function listEmployees(req, res) {
  if (!isDbReady()) {
    return res.json({ employees: listDevEmployees(req.user.businessId) });
  }

  const employees = await listEmployeesByBusiness(req.user.businessId);
  res.json({ employees: employees.map(formatEmployee) });
}

export async function createEmployee(req, res) {
  const { name, email, password } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  if (!isDbReady()) {
    const employee = createDevEmployee({
      businessId: req.user.businessId,
      name,
      email: normalizedEmail,
      password,
    });

    if (!employee) {
      throw new AppError("Bu email zaten kayitli", 409, "EMAIL_EXISTS");
    }

    return res.status(201).json({ employee });
  }

  const exists = await findUserByEmailInBusiness(req.user.businessId, normalizedEmail);
  if (exists) {
    throw new AppError("Bu email zaten kayitli", 409, "EMAIL_EXISTS");
  }

  const employee = await createUser({
    businessId: req.user.businessId,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: await hashPassword(password),
    role: "garson",
  });

  res.status(201).json({ employee: formatEmployee(employee) });
}

export async function updateEmployeeHandler(req, res) {
  const { name, email, password, active } = req.body;

  if (!isDbReady()) {
    const updated = updateDevEmployee(req.params.id, {
      businessId: req.user.businessId,
      name,
      email,
      password,
      active,
    });
    if (updated?.conflict) {
      throw new AppError("Bu email zaten kayitli", 409, "EMAIL_EXISTS");
    }
    if (!updated) {
      throw new AppError("Calisan bulunamadi", 404, "EMPLOYEE_NOT_FOUND");
    }
    return res.json({ employee: updated });
  }

  const employee = await findEmployeeById(req.user.businessId, req.params.id);
  if (!employee) {
    throw new AppError("Calisan bulunamadi", 404, "EMPLOYEE_NOT_FOUND");
  }

  if (email && email.toLowerCase().trim() !== employee.email) {
    const normalizedEmail = email.toLowerCase().trim();
    const exists = await findUserByEmailInBusiness(req.user.businessId, normalizedEmail);
    if (exists) {
      throw new AppError("Bu email zaten kayitli", 409, "EMAIL_EXISTS");
    }
  }

  const patch = {
    name: name ? name.trim() : employee.name,
    email: email ? email.toLowerCase().trim() : employee.email,
    active: typeof active === "boolean" ? active : employee.active,
    passwordHash: password ? await hashPassword(password) : employee.passwordHash,
  };

  const updated = await updateEmployee(req.user.businessId, req.params.id, patch);
  res.json({ employee: formatEmployee(updated) });
}

export async function deleteEmployeeHandler(req, res) {
  if (!isDbReady()) {
    const deleted = deleteDevEmployee(req.params.id, req.user.businessId);
    if (!deleted) {
      throw new AppError("Calisan bulunamadi", 404, "EMPLOYEE_NOT_FOUND");
    }
    return res.json({ message: "Calisan silindi" });
  }

  const deleted = await deleteEmployee(req.user.businessId, req.params.id);
  if (!deleted) {
    throw new AppError("Calisan bulunamadi", 404, "EMPLOYEE_NOT_FOUND");
  }

  res.json({ message: "Calisan silindi" });
}
