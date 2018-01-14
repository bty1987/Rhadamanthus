package com.fanglin.dingding.po;


public class TextMessage extends Message {
	
	private String content;	
	
	public TextMessage(String content) {
		super();
		this.content = content;
	}
	
	@Override
	public String type() {
		return "text";
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}
}
