"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTodoDto = void 0;
const create_todo_dto_1 = require("./create-todo-dto");
const mapped_types_1 = require("@nestjs/mapped-types");
class UpdateTodoDto extends (0, mapped_types_1.PartialType)(create_todo_dto_1.CreateTodoDto) {
}
exports.UpdateTodoDto = UpdateTodoDto;
//# sourceMappingURL=update-todo-dto.js.map