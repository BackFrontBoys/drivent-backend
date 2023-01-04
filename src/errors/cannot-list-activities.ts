import { ApplicationError } from "@/protocols";

export function cannotListActivitiesError(): ApplicationError {
  return {
    name: "cannotListActivitiesError",
    message: "Cannot list activities!",
  };
}
