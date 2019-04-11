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
import com.fanglin.personel.vo.UserVO;

public class DrawLineVO implements Serializable {

	private static final long serialVersionUID = -6225111181876631L;

	private long dlId;
	
	private DecorationVO decoration;

	private Timestamp applayTime;
	
	private String content;
	
	private Timestamp actualStartTime;
	
	private Timestamp actualEndTime;
	
	private short status;
	
	private Integer count;
	
	private UserVO applayUser;
	
	private DrawLineGroupVO drawLineGroup;
	
	private UserVO drawLineUser;
	
	private String startTime;
	
	private String endTime;
	
	public DrawLineVO(){
		super();
	}
	
	public DrawLineVO(DecorationVO decoration, UserVO applayUser,
			DrawLineGroupVO drawLineGroup, UserVO drawLineUser) {
		super();
		this.decoration = decoration;
		this.applayUser = applayUser;
		this.drawLineGroup = drawLineGroup;
		this.drawLineUser = drawLineUser;
	}

	public void setDlId(long dlId) {
		this.dlId = dlId;
	}

	public Long getDlId() {
		return dlId;
	}

	public DecorationVO getDecoration() {
		return decoration;
	}

	public void setDecoration(DecorationVO decoration) {
		this.decoration = decoration;
	}

	@JSON(format="yyyy-MM-dd")
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

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getActualStartTime() {
		return actualStartTime;
	}

	public void setActualStartTime(Timestamp actualStartTime) {
		this.actualStartTime = actualStartTime;
	}

	@JSON(format="yyyy-MM-dd HH:mm:ss")
	public Timestamp getActualEndTime() {
		return actualEndTime;
	}

	public void setActualEndTime(Timestamp actualEndTime) {
		this.actualEndTime = actualEndTime;
	}

	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	public Integer getCount() {
		return count;
	}

	public void setCount(Integer count) {
		this.count = count;
	}

	public UserVO getApplayUser() {
		return applayUser;
	}

	public void setApplayUser(UserVO applayUser) {
		this.applayUser = applayUser;
	}

	public DrawLineGroupVO getDrawLineGroup() {
		return drawLineGroup;
	}

	public void setDrawLineGroup(DrawLineGroupVO drawLineGroup) {
		this.drawLineGroup = drawLineGroup;
	}

	public UserVO getDrawLineUser() {
		return drawLineUser;
	}

	public void setDrawLineUser(UserVO drawLineUser) {
		this.drawLineUser = drawLineUser;
	}

	public String getStartTime() {
		return startTime;
	}

	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}

	public String getEndTime() {
		return endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
	
}
