package com.fanglin.communion.vo;

import java.io.Serializable;
import java.util.List;

public class AssistanceItemVO implements Serializable {

	private static final long serialVersionUID = 167640262732099707L;

	private Long aiid;

	private Long aid;

	private String title;

	private String content;

	private Short sort;

	private List<DataDrawingVO> drawings;

	public AssistanceItemVO() {
		super();
	}

	public AssistanceItemVO(List<DataDrawingVO> drawings) {
		super();
		this.drawings = drawings;
	}

	public Long getAiid() {
		return aiid;
	}

	public void setAiid(Long aiid) {
		this.aiid = aiid;
	}

	public Long getAid() {
		return aid;
	}

	public void setAid(Long aid) {
		this.aid = aid;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Short getSort() {
		return sort;
	}

	public void setSort(Short sort) {
		this.sort = sort;
	}

	public List<DataDrawingVO> getDrawings() {
		return drawings;
	}

	public void setDrawings(List<DataDrawingVO> drawings) {
		this.drawings = drawings;
	}

}