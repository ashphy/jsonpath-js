import type {
	Json,
	JsonArray,
	JsonObject,
	JsonPrimitive,
	JsonValue,
} from "./types/json";

export const isJsonObject = (json: Json): json is JsonObject => {
	return json !== null && typeof json === "object" && !Array.isArray(json);
};

export const isJsonPrimitive = (json: Json): json is JsonPrimitive => {
	return (
		json === null ||
		json === true ||
		json === false ||
		typeof json === "string" ||
		typeof json === "number"
	);
};

export const isJsonArray = (json: Json): json is JsonArray => {
	return Array.isArray(json);
};

export const toArray = (obj: JsonArray | JsonObject): Json[] => {
	if (Array.isArray(obj)) {
		return obj;
	}
	return mapJsonObject(obj);
};

export const mapJsonObject = (obj: JsonObject): JsonValue[] => {
	return Object.entries(obj).map(([_, value]) => {
		return value;
	});
};
