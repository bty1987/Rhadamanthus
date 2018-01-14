package com.fanglin.production.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.vo.WorkflowVO;
import com.fanglin.utils.Paging;

public interface WorkflowService {
	
	public void  pageWorkflow(Paging paging ,List<Filter> filter, int company);

	public List<WorkflowVO> queryWorkflow(int company);

	public void addWorkflow(WorkflowVO workflowVO,int company);

	public int updateWorkflow(WorkflowVO  workflowVO) throws FLException;

	public int updateWorkflowForStatus(WorkflowVO workflowVO) throws FLException;
	
}
