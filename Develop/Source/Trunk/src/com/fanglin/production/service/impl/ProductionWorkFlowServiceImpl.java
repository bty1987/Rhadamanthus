package com.fanglin.production.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.production.dao.ProductionPlanDao;
import com.fanglin.production.dao.ProductionUserWorkFlowDao;
import com.fanglin.production.dao.ProductionWorkFlowDao;
import com.fanglin.production.dao.ProductionWorkPlanDao;
import com.fanglin.production.po.ProductionPlanPO;
import com.fanglin.production.po.ProductionUserWorkFlowPO;
import com.fanglin.production.po.ProductionWorkFlowPO;
import com.fanglin.production.po.ProductionWorkPlanPO;
import com.fanglin.production.service.ProductionWorkFlowService;
import com.fanglin.production.vo.ProductionWorkFlowVO;
import com.fanglin.production.vo.WorkflowVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("ProductionWorkFlowService")
@Transactional(readOnly = true)
public class ProductionWorkFlowServiceImpl  implements ProductionWorkFlowService {
	@Autowired
	private ProductionWorkFlowDao productionworkflowDao;
	@Autowired
	private ProductionWorkPlanDao productionworkPlanDao;
	@Autowired
	private UserDao userDao;
	@Autowired
	private ProductionPlanDao productionPlanDao;
	@Autowired
	private ProductionUserWorkFlowDao productionUserWorkFlowDao;
	@Override
	public List<ProductionWorkFlowVO> queryProductionWorkFlowByPwpid(ProductionWorkFlowVO productionworkflowVO) {
		
		List<ProductionWorkFlowPO> productionworkflowPOs = productionworkflowDao.queryProductionWorkFlowByPwpid(productionworkflowVO.getPwpid());
		List<ProductionWorkFlowVO> productionworkflowVOs = new ArrayList<ProductionWorkFlowVO>();
		
		for(ProductionWorkFlowPO productionWorkFlowPO : productionworkflowPOs){
			productionworkflowVO = new ProductionWorkFlowVO(new WorkflowVO());
			BeanUtil.copyProperties(productionWorkFlowPO, productionworkflowVO, Arrays.asList("workflow"));
			BeanUtil.copyProperties(productionWorkFlowPO.getWorkflow(), productionworkflowVO.getWorkflow());
			productionworkflowVOs.add(productionworkflowVO);
		}
		return productionworkflowVOs;
	}
	
	@Override
	public ProductionWorkFlowVO queryProductionWorkFlowByPwpidAWfid(ProductionWorkFlowVO productionworkflowVO) throws FLException {
		ProductionWorkFlowPO productionWorkFlowPO = productionworkflowDao.queryProductionWorkFlowByPwpidAWfid(productionworkflowVO.getPwpid(), productionworkflowVO.getWorkflow().getWfid());
		if(productionWorkFlowPO == null){
			throw new FLException(220012, "计划工序不存在");
		}
		
		ProductionWorkFlowVO productionWorkFlowVO = new ProductionWorkFlowVO(new WorkflowVO());
		BeanUtil.copyProperties(productionWorkFlowPO, productionWorkFlowVO, Arrays.asList("workflow"));
		BeanUtil.copyProperties(productionWorkFlowPO.getWorkflow(), productionWorkFlowVO.getWorkflow());
		
		return productionWorkFlowVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int operateProductionWorkFlow(String no,long uid,ProductionWorkFlowVO productionworkflowVO) throws FLException{
		
		ProductionPlanPO productionPlanPO = productionPlanDao.queryProductionPlanByNo(no);
		if(productionPlanPO == null){
			throw new FLException(220008, "计划单不存在");		
		}
		
		List<ProductionWorkPlanPO> productionworkplans = productionworkPlanDao.queryProductionWorkPlanByPpid(productionPlanPO.getPpid());
		ProductionWorkFlowPO productionworkflowPO = null;
		for(ProductionWorkPlanPO productionWorkPlanPO : productionworkplans){
			productionworkflowPO = productionworkflowDao.queryProductionWorkFlowByPwpidAWfid(productionWorkPlanPO.getPwpid(), productionworkflowVO.getWorkflow().getWfid());
			if(productionworkflowPO == null){
				continue;
			}
			
			ProductionUserWorkFlowPO productionUserWorkFlowPO = new ProductionUserWorkFlowPO(new ProductionWorkFlowPO(),new UserPO());
			productionUserWorkFlowPO.setPwfid(productionworkflowPO);
			productionUserWorkFlowPO.setOuid(userDao.get(uid));
			productionUserWorkFlowPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
			
			productionUserWorkFlowDao.save(productionUserWorkFlowPO);
			
		}
				
		return 0;
	}

	
}
