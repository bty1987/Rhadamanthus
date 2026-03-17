package com.fanglin.sales.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.sales.service.OalesRecordService;
import com.fanglin.sales.vo.OalesRecordVO;

/**
 * 外销单操作记录Action控制器
 *
 * @author AI Assistant
 * @date 2026-03-17
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class OalesRecordAction extends BaseListAction {

	private static final long serialVersionUID = -1234567890123456789L;

	@Autowired
	private OalesRecordService oalesRecordService;

	private OalesRecordVO oalesRecord;

	private List<OalesRecordVO> oalesRecords;

	private Long oid;

	/**
	 * 分页查询外销单操作记录
	 *
	 * @return 成功
	 * @throws FLException 异常
	 */
	@Action(value = "pageOalesRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageOalesRecord() throws FLException {
		oalesRecordService.pageOalesRecord(getPaging(), getFilters(), oid);
		return SUCCESS;
	}

	/**
	 * 根据外销单ID查询操作记录
	 *
	 * @return 成功
	 * @throws FLException 异常
	 */
	@Action(value = "queryOalesRecordByOid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryOalesRecordByOid() throws FLException {
		if (oid != null) {
			oalesRecords = oalesRecordService.queryOalesRecordByOid(oid);
		}
		return SUCCESS;
	}

	public OalesRecordVO getOalesRecord() {
		return oalesRecord;
	}

	public void setOalesRecord(OalesRecordVO oalesRecord) {
		this.oalesRecord = oalesRecord;
	}

	public List<OalesRecordVO> getOalesRecords() {
		return oalesRecords;
	}

	public void setOalesRecords(List<OalesRecordVO> oalesRecords) {
		this.oalesRecords = oalesRecords;
	}

	public Long getOid() {
		return oid;
	}

	public void setOid(Long oid) {
		this.oid = oid;
	}
}
