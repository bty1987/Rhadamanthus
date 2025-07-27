package com.fanglin.balance.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.balance.service.BalanceSelectionRecordService;
import com.fanglin.balance.vo.BalanceSelectionRecordVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BalanceSelectionRecordAction extends BaseListAction {

	private static final long serialVersionUID = 5763647863792939363L;

	@Autowired
	private BalanceSelectionRecordService balanceSelectionRecordService;

	private List<BalanceSelectionRecordVO> balanceSelectionRecords;

	private BalanceSelectionRecordVO balanceSelectionRecord;

	@Action(value = "queryBalanceSelectionRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryBalanceSelectionRecord() throws FLException {

		balanceSelectionRecords = balanceSelectionRecordService.queryBalanceAccount(balanceSelectionRecord);

		return SUCCESS;
	}

	public List<BalanceSelectionRecordVO> getBalanceSelectionRecords() {
		return balanceSelectionRecords;
	}

	public void setBalanceSelectionRecords(List<BalanceSelectionRecordVO> balanceSelectionRecords) {
		this.balanceSelectionRecords = balanceSelectionRecords;
	}

	public BalanceSelectionRecordVO getBalanceSelectionRecord() {
		return balanceSelectionRecord;
	}

	public void setBalanceSelectionRecord(BalanceSelectionRecordVO balanceSelectionRecord) {
		this.balanceSelectionRecord = balanceSelectionRecord;
	}

}
