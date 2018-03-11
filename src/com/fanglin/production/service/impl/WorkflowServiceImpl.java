package com.fanglin.production.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.production.dao.WorkflowDao;
import com.fanglin.production.po.WorkflowPO;
import com.fanglin.production.service.WorkflowService;
import com.fanglin.production.vo.WorkflowVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("workflowService")
@Transactional(readOnly = true)
public class WorkflowServiceImpl implements WorkflowService {

	@Autowired 
	private  WorkflowDao workflowDao;

	@Override
	public void pageWorkflow(Paging paging, List<Filter> filter,int company) {
		
		List<WorkflowPO> workflowActionPOs = workflowDao.pageWorkflow(paging, filter,company);
		List<WorkflowVO> workflowActionVOs = new ArrayList<WorkflowVO>() ;
		
			for (WorkflowPO workflowActionPO : workflowActionPOs) {
				
				WorkflowVO	 workflowActionVO = new  WorkflowVO();
				BeanUtil.copyProperties(workflowActionPO, workflowActionVO);
				
				workflowActionVOs.add(workflowActionVO);
			}
			paging.setData(workflowActionVOs);
		
	}

	@Override
	public List<WorkflowVO> queryWorkflow(int company) {
		
		List<WorkflowPO>  workflowPOs =	workflowDao.queryWorkflow(company);
		List<WorkflowVO>  workflows =new ArrayList<WorkflowVO>();
		for (WorkflowPO workflowPO : workflowPOs) {
			
			WorkflowVO workflowVO =new WorkflowVO();
			workflowVO.setWfid(workflowPO.getWfid()); 
			workflowVO.setName(workflowPO.getName());
			workflowVO.setStatus(workflowPO.getStatus());
			
			workflows.add(workflowVO);
		}
		return workflows;
		
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addWorkflow(WorkflowVO workflow,int company) {
		
		WorkflowPO workflowPO = new WorkflowPO() ;
		workflowPO.setCompany(company);
		workflowPO.setName(workflow.getName());
		workflowPO.setStatus(WorkflowPO.COLUMN_STATUS_STR);
		workflowDao.save(workflowPO);
		
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateWorkflow(WorkflowVO workflow) throws FLException {
	
		WorkflowPO workflowPO = workflowDao.get(workflow.getWfid());
		
		if (workflowPO == null){
			throw new FLException (210017,"工序不存在");
		}
		
		BeanUtil.copyPropertie(workflow, workflowPO);
		
		workflowDao.update(workflowPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateWorkflowForStatus(WorkflowVO workflow) throws FLException {
		
		WorkflowPO WorkflowPO = workflowDao.get(workflow.getWfid());
		
		if (WorkflowPO == null){
			throw new FLException (210017,"工序不存在");
		}
		
		WorkflowPO.setStatus(workflow.getStatus());
		
		workflowDao.update(WorkflowPO);
		
		return 0;
	}
		
}
