import type {Handle} from "@sveltejs/kit/hooks";

export const handleNoop: Handle = ({event, resolve}) => {
	return resolve(event);
}
