import type {Handle} from "@sveltejs/kit";

export const handleNoop: Handle = ({event, resolve}) => {
	return resolve(event);
}
