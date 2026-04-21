package com.fanglin.quotation.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import org.apache.struts2.json.annotations.JSON;

import com.fanglin.personel.vo.UserBaseVO;

/**
 * 预算员规则表 VO（人员维度）
 * 
 * <p>
 * 每个用户一条规则记录，公司/部门/业务类型通过 items 列表维护
 * </p>
 * 
 * @author Claude AI
 * @date 2026-04-21
 */
public class QuotationAssignUserRuleVO implements Serializable {

	private static final long serialVersionUID = -988461889194269257L;

	/** 预算员规则ID */
	private Long qaurid;

	/** 预算员用户对象 */
	private UserBaseVO user;

	/** 状态: 1-待分配，2-制作中，3-停止 */
	private Short status;

	/** 最后完成时间 */
	private Timestamp lastFinishTime;

	/** 当前任务数量 */
	private Integer currentTaskCount;

	/** 创建时间 */
	private Timestamp createTime;

	/** 更新时间 */
	private Timestamp updateTime;

	/** 预算员支持的规则明细列表（公司/部门/业务类型） */
	private List<QuotationAssignUserRuleItemVO> items;

	public QuotationAssignUserRuleVO() {
		super();
	}

	public QuotationAssignUserRuleVO(UserBaseVO user) {
		super();
		this.user = user;
	}

	// ==================== Getter & Setter ====================

	public Long getQaurid() {
		return qaurid;
	}

	public void setQaurid(Long qaurid) {
		this.qaurid = qaurid;
	}

	public UserBaseVO getUser() {
		return user;
	}

	public void setUser(UserBaseVO user) {
		this.user = user;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getLastFinishTime() {
		return lastFinishTime;
	}

	public void setLastFinishTime(Timestamp lastFinishTime) {
		this.lastFinishTime = lastFinishTime;
	}

	public Integer getCurrentTaskCount() {
		return currentTaskCount;
	}

	public void setCurrentTaskCount(Integer currentTaskCount) {
		this.currentTaskCount = currentTaskCount;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	@JSON(format = "yyyy-MM-dd HH:mm:ss")
	public Timestamp getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}

	public List<QuotationAssignUserRuleItemVO> getItems() {
		return items;
	}

	public void setItems(List<QuotationAssignUserRuleItemVO> items) {
		this.items = items;
	}
}
