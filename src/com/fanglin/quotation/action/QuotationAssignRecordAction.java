/**
 * @File Name     : QuotationAssignRecordAction.java
 * @Package      : com.fanglin.quotation.action
 * @Version       : 1.0
 * @Date          : 2026-03-20
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 装修单预算分配记录表 Action 控制器
 */

package com.fanglin.quotation.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.service.QuotationAssignRecordService;
import com.fanglin.quotation.vo.QuotationAssignRecordVO;

/**
 * 装修单预算分配记录表 Action 控制器
 * 
 * <p>
 * 职责：处理分配记录查询的 HTTP 请求
 * </p>
 * 
 * <p>
 * 主要功能：
 * </p>
 * <ul>
 * <li>分页查询分配记录列表</li>
 * <li>查询分配记录详情</li>
 * <li>创建分配记录</li>
 * <li>根据装修单号查询分配记录</li>
 * </ul>
 * 
 * @author Claude AI
 * @version 1.0
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationAssignRecordAction extends BaseListAction {

	private static final long serialVersionUID = 9067044185640315559L;

	@Autowired
	private QuotationAssignRecordService quotationAssignRecordService;

	/**
	 * 分配记录对象（用于接收前端参数）
	 */
	private QuotationAssignRecordVO quotationAssignRecord;

	/**
	 * 分配记录列表（用于返回查询结果）
	 */
	private List<QuotationAssignRecordVO> quotationAssignRecords;

	/**
	 * 分页查询分配记录列表
	 * 
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "pageQuotationAssignRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageQuotationAssignRecord() throws FLException {

		quotationAssignRecordService.pageQuotationAssignRecord(getPaging(), getFilters());

		return SUCCESS;
	}

	/**
	 * 查询分配记录详情
	 * 
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "queryQuotationAssignRecordById", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationAssignRecordById() throws FLException {

		quotationAssignRecord = quotationAssignRecordService.queryQuotationAssignRecordById(quotationAssignRecord);

		return SUCCESS;
	}

	/**
	 * 创建分配记录（通常由系统自动调用，不对外开放）
	 * 
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "createQuotationAssignRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String createQuotationAssignRecord() throws FLException {

		quotationAssignRecordService.createQuotationAssignRecord(quotationAssignRecord);

		return SUCCESS;
	}

	/**
	 * 根据装修单号查询分配记录列表
	 * 
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "queryQuotationAssignRecordByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationAssignRecordByOrderId() throws FLException {

		quotationAssignRecords = quotationAssignRecordService.queryQuotationAssignRecordByOrderId(quotationAssignRecord);

		return SUCCESS;
	}

	// ==================== Getter & Setter ====================

	public QuotationAssignRecordVO getQuotationAssignRecord() {
		return quotationAssignRecord;
	}

	public void setQuotationAssignRecord(QuotationAssignRecordVO quotationAssignRecord) {
		this.quotationAssignRecord = quotationAssignRecord;
	}

	public List<QuotationAssignRecordVO> getQuotationAssignRecords() {
		return quotationAssignRecords;
	}

	public void setQuotationAssignRecords(List<QuotationAssignRecordVO> quotationAssignRecords) {
		this.quotationAssignRecords = quotationAssignRecords;
	}
}
