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
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.production.dao.ProductionWorkFlowDao;
import com.fanglin.production.dao.ProductionWorkPlanDao;
import com.fanglin.production.po.ProductionWorkFlowPO;
import com.fanglin.production.po.ProductionWorkPlanPO;
import com.fanglin.production.service.ProductionWorkFlowService;
import com.fanglin.production.vo.ProductionWorkFlowVO;
import com.fanglin.production.vo.WorkflowVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("ProductionWorkFlowService")
@Transactional(readOnly = true)
public class ProductionWorkFlowServiceImpl implements ProductionWorkFlowService {

	@Autowired
	private ProductionWorkFlowDao productionworkflowDao;

	@Autowired
	private ProductionWorkPlanDao productionWorkPlanDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<ProductionWorkFlowVO> queryProductionWorkFlowByPwpid(ProductionWorkFlowVO productionworkflowVO) {

		List<ProductionWorkFlowPO> productionworkflowPOs = productionworkflowDao.queryProductionWorkFlowByPwpid(productionworkflowVO.getPwpid());
		List<ProductionWorkFlowVO> productionworkflowVOs = new ArrayList<ProductionWorkFlowVO>();

		for (ProductionWorkFlowPO productionWorkFlowPO : productionworkflowPOs) {
			
			productionworkflowVO = new ProductionWorkFlowVO(new UserBaseVO(), new WorkflowVO());
			
			BeanUtil.copyProperties(productionWorkFlowPO, productionworkflowVO, Arrays.asList("operator","workflow"));
			BeanUtil.copyProperties(productionWorkFlowPO.getOperater(), productionworkflowVO.getOperator(), Arrays.asList("duty", "dept"));
			BeanUtil.copyProperties(productionWorkFlowPO.getWorkflow(), productionworkflowVO.getWorkflow());
			
			productionworkflowVOs.add(productionworkflowVO);
		}
		
		return productionworkflowVOs;
	}

	@Override
	public ProductionWorkFlowVO queryProductionWorkFlowByPwpidAWfid(ProductionWorkFlowVO productionworkflowVO) throws FLException {

		ProductionWorkFlowPO productionWorkFlowPO = productionworkflowDao.queryProductionWorkFlowByPwpidAWfid(productionworkflowVO.getPwpid(), productionworkflowVO.getWorkflow().getWfid());

		if (productionWorkFlowPO == null) {
			throw new FLException(220012, "计划工序不存在");
		}

		ProductionWorkFlowVO productionWorkFlowVO = new ProductionWorkFlowVO(new UserBaseVO(), new WorkflowVO());
		BeanUtil.copyProperties(productionWorkFlowPO, productionworkflowVO, Arrays.asList("operator","workflow"));
		BeanUtil.copyProperties(productionWorkFlowPO.getOperater(), productionworkflowVO.getOperator(), Arrays.asList("duty", "dept"));
		BeanUtil.copyProperties(productionWorkFlowPO.getWorkflow(), productionworkflowVO.getWorkflow());
		
		return productionWorkFlowVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int operateProductionWorkFlow(ProductionWorkFlowVO productionworkflowVO, String userId) throws FLException {

		ProductionWorkFlowPO productionWorkFlowPO = productionworkflowDao.get(productionworkflowVO.getPwfid());

		if (productionWorkFlowPO == null) {
			throw new FLException(220012, "计划工序不存在");
		}
		
		if (productionWorkFlowPO.getStatus() == ProductionWorkFlowPO.STATUS_OPERATED_INT) {
			throw new FLException(220013 , "计划工序不可操作");
		}

		productionWorkFlowPO.setStatus(ProductionWorkFlowPO.STATUS_OPERATED_INT);
		productionWorkFlowPO.setOperater(userDao.queryUserByUserId(userId));
		productionWorkFlowPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));

		productionworkflowDao.update(productionWorkFlowPO);

		Integer countProductionWorkFlowByPwpid = productionworkflowDao.countProductionWorkFlowByPwpid(productionWorkFlowPO.getPwpid(), ProductionWorkPlanPO.STATUS_OPERATED_INT, productionworkflowVO.getPwfid());

		ProductionWorkPlanPO productionWorkPlanPO = productionWorkPlanDao.get(productionWorkFlowPO.getPwpid());

		if (productionWorkPlanPO.getStatus() == ProductionWorkPlanPO.STATUS_INVALID_INT) {
			throw new FLException(220013 , "计划工序不可操作");
		}
		
		if(countProductionWorkFlowByPwpid == 0){

			productionWorkPlanPO.setStatus(ProductionWorkPlanPO.STATUS_OPERATED_INT);
			productionWorkPlanDao.update(productionWorkPlanPO);
		}

		return 0;
	}

}
