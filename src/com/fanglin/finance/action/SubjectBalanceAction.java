/**
 * @File Name		: SubjectBalanceAction.java
 * @Package   	: com.fanglin.finance.action
 * @Version		: 1.0
 * @Date			: 2016-4-17
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.finance.service.SubjectBalanceService;
import com.fanglin.finance.vo.SubjectBalanceVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SubjectBalanceAction extends BaseListAction {

	private static final long serialVersionUID = -1869545684147351884L;
	
	@Autowired
	private SubjectBalanceService subjectBalanceService;
	
	private List<SubjectBalanceVO> subjectBalances;
	
	private SubjectBalanceVO subjectBalance;
	
	@Action(value = "pageSubjectBalance", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) } )
	public String pageSubjectBalance(){
		
		subjectBalanceService.pageSubjectBalance(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "querySubjectBalance", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) } )
	public String querySubjectBalance(){
		
		subjectBalances = subjectBalanceService.querySubjectBalance(getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "updateSubjectBalanceForBalance", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) } )
	public String updateSubjectBalanceForBalance() throws FLException{
		
		subjectBalanceService.updateSubjectBalanceForBalance(subjectBalance);
		
		return SUCCESS;
	}

	public List<SubjectBalanceVO> getSubjectBalances() {
		return subjectBalances;
	}

	public void setSubjectBalances(List<SubjectBalanceVO> subjectBalances) {
		this.subjectBalances = subjectBalances;
	}

	public SubjectBalanceVO getSubjectBalance() {
		return subjectBalance;
	}

	public void setSubjectBalance(SubjectBalanceVO subjectBalance) {
		this.subjectBalance = subjectBalance;
	}

}
