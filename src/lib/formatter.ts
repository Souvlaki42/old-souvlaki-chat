import Filter from "bad-words";

export function format(text: string) {
	text = linkify(text);
	text = badWords(text);
	return text;
}

function linkify(text: string) {
	const regex =
		/(?:(?:https?|s?ftp):\/\/)?(?:www\.)?[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)+(?:\/[\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/gi;
	return text.replace(regex, (url) => {
		return `<a href="${url}" target="_blank" class="link">${url}</a>`;
	});
}

function badWords(text: string) {
	const filter = new Filter();
	return filter.clean(text);
}