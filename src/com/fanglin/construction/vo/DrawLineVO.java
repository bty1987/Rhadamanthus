/**
 * @File Name	: QuotationVO
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date		: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email		: 
 * @Describing	: 
 */

package com.fanglin.construction.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.data.common.vo.DrawLineGroupVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.vo.UserBaseVO;

public class DrawLineVO implements Serializable {

	private static final long serialVersionUID = -6225111181876631L;

	private Long dlid;

	private DecorationVO decoration;

	private Timestamp applayTime;

	private String content;

	private Long actualTime;

	private Timestamp startTime;

	private Timestamp endTime;

	private Short status;

	private Integer count;

	private UserBaseVO appler;

	private DrawLineGroupVO group;

	private UserBaseVO drawer;

	public DrawLineVO() {
		super();
	}

	public DrawLineVO(DecorationVO decoration, UserBaseVO appler, DrawLineGroupVO group, UserBaseVO drawer) {
		super();
		this.decoration = decoration;
		this.appler = appler;
		this.group = group;
		this.drawer = drawer;
	}

	public Long getDlid() {
		return dlid;
	}

	public void setDlid(Long dlid) {
		this.dlid = dlid;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getApplayTime() {
		return applayTime;
	}

	public void setApplayTime(Timestamp applayTime) {
		this.applayTime = applayTime;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Long getActualTime() {
		return actualTime;
	}

	public void setActualTime(Long actualTime) {
		this.actualTime = actualTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getStartTime() {
		return startTime;
	}

	public void setStartTime(Timestamp startTime) {
		this.startTime = startTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getEndTime() {
		return endTime;
	}

	public void setEndTime(Timestamp endTime) {
		this.endTime = endTime;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Integer getCount() {
		return count;
	}

	public void setCount(Integer count) {
		this.count = count;
	}

	public UserBaseVO getAppler() {
		return appler;
	}

	public void setAppler(UserBaseVO appler) {
		this.appler = appler;
	}

	public DrawLineGroupVO getGroup() {
		return group;
	}

	public void setGroup(DrawLineGroupVO group) {
		this.group = group;
	}

	public UserBaseVO getDrawer() {
		return drawer;
	}

	public void setDrawer(UserBaseVO drawer) {
		this.drawer = drawer;
	}

}
