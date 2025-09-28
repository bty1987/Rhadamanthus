/**
 * @File Name	: ReworkVo.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date		: 2014-9-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.vo;

import java.io.Serializable;
import java.sql.Timestamp;

import org.apache.struts2.json.annotations.JSON;
import com.fanglin.data.common.vo.ConstructionPaceNodeVO;

public class ConstructionPlanVO implements Serializable {

	private static final long serialVersionUID = 4826596660979940757L;

	private Long cpid;

	private Long cid;

	private String orderId;

	private String name;

	private ConstructionPaceNodeVO node;

	private Long cnid;

	private Integer connum;

	private Integer comnum;

	private Integer prenum;

	private Integer postnum;

	private String phase;

	private String material;

	private String period;

	private Timestamp createTime;

	private Timestamp startTime;

	private Timestamp endTime;

	private Integer sort;

	private String content;

	private String comment;

	public ConstructionPlanVO() {
		super();
	}

	public ConstructionPlanVO(String orderId) {
		super();
		this.orderId = orderId;
	}

	public ConstructionPlanVO(ConstructionPaceNodeVO node) {
		super();
		this.node = node;
	}

	public Long getCpid() {
		return cpid;
	}

	public void setCpid(Long cpid) {
		this.cpid = cpid;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public Long getCnid() {
		return cnid;
	}

	public void setCnid(Long cnid) {
		this.cnid = cnid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public ConstructionPaceNodeVO getNode() {
		return node;
	}

	public void setNode(ConstructionPaceNodeVO node) {
		this.node = node;
	}

	public Integer getConnum() {
		return connum;
	}

	public void setConnum(Integer connum) {
		this.connum = connum;
	}

	public Integer getComnum() {
		return comnum;
	}

	public void setComnum(Integer comnum) {
		this.comnum = comnum;
	}

	public Integer getPrenum() {
		return prenum;
	}

	public void setPrenum(Integer prenum) {
		this.prenum = prenum;
	}

	public Integer getPostnum() {
		return postnum;
	}

	public void setPostnum(Integer postnum) {
		this.postnum = postnum;
	}

	public String getPhase() {
		return phase;
	}

	public void setPhase(String phase) {
		this.phase = phase;
	}

	public String getMaterial() {
		return material;
	}

	public void setMaterial(String material) {
		this.material = material;
	}

	public String getPeriod() {
		return period;
	}

	public void setPeriod(String period) {
		this.period = period;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getStartTime() {
		return startTime;
	}

	public void setStartTime(Timestamp startTime) {
		this.startTime = startTime;
	}

	@JSON(format = "yyyy-MM-dd")
	public Timestamp getEndTime() {
		return endTime;
	}

	public void setEndTime(Timestamp endTime) {
		this.endTime = endTime;
	}

	public Integer getSort() {
		return sort;
	}

	public void setSort(Integer sort) {
		this.sort = sort;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

}
