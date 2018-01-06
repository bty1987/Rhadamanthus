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
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.production.dao.ProductionPlanDao;
import com.fanglin.production.dao.ProductionWorkFlowDao;
import com.fanglin.production.dao.ProductionWorkPlanDao;
import com.fanglin.production.dao.WorkflowDao;
import com.fanglin.production.dao.WorkflowPlanDao;
import com.fanglin.production.dao.WorkplanDao;
import com.fanglin.production.po.ProductionPlanPO;
import com.fanglin.production.po.ProductionWorkFlowPO;
import com.fanglin.production.po.ProductionWorkPlanPO;
import com.fanglin.production.po.WorkflowPO;
import com.fanglin.production.po.WorkflowPlanPO;
import com.fanglin.production.po.WorkplanPO;
import com.fanglin.production.service.ProductionWorkPlanService;
import com.fanglin.production.vo.ProductionWorkPlanVO;
import com.fanglin.production.vo.WorkplanVO;
import com.fanglin.production.vo.WorkshopVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("ProductionWorkPlanService")
@Transactional(readOnly = true)
public class ProductionWorkPlanServiceImpl implements ProductionWorkPlanService {
	
	@Autowired
	private ProductionWorkPlanDao productionWorkPlanDao;
	@Autowired
	private ProductionPlanDao productionplanDao;
	@Autowired
	private WorkflowPlanDao workflowplanDao;
	@Autowired
	private ProductionWorkFlowDao productionworkflowDao;
	@Autowired
	private UserDao userDao;
	@Autowired
	private WorkplanDao workplanDao;
	@Autowired
	private WorkflowDao workflowDao;
	
	@Override
	public List<ProductionWorkPlanVO> queryProductionWorkPlanByPpid(long ppid) {
		List<ProductionWorkPlanPO> ProductionWorkPlanPOs = productionWorkPlanDao.queryProductionWorkPlanByPpid(ppid);
		List<ProductionWorkPlanVO> ProductionWorkPlanVOs = new ArrayList<ProductionWorkPlanVO>();
		
		for(ProductionWorkPlanPO productionWorkPlanPO : ProductionWorkPlanPOs){
			ProductionWorkPlanVO productionWorkPlanVO = new ProductionWorkPlanVO(new WorkplanVO(new WorkshopVO()), new UserBaseVO());
			
			BeanUtil.copyProperties(productionWorkPlanPO, productionWorkPlanVO, Arrays.asList("workplan","creater"));
			BeanUtil.copyProperties(productionWorkPlanPO.getWorkplan(), productionWorkPlanVO.getWorkplan(),Arrays.asList("workshop"));
			BeanUtil.copyProperties(productionWorkPlanPO.getWorkplan().getWorkshop(), productionWorkPlanVO.getWorkplan().getWorkshop(), "");
			BeanUtil.copyProperties(productionWorkPlanPO.getCreater(),productionWorkPlanVO.getCreater(),Arrays.asList("duty","dept"));
	
			ProductionWorkPlanVOs.add(productionWorkPlanVO);
		}
		return ProductionWorkPlanVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addProductionWorkPlan(ProductionWorkPlanVO productionWorkPlanVO,String userId) throws FLException {
		
		ProductionPlanPO productionPlanPO = productionplanDao.get(productionWorkPlanVO.getPpid());
		if(productionPlanPO == null){
			throw new FLException(220008, "生产计划单不存在");
		}
		
		ProductionWorkPlanPO productionworkplanPO = productionWorkPlanDao.queryProductionWorkPlanByPpidAWpid(productionWorkPlanVO.getPpid(), productionWorkPlanVO.getWorkplan().getWpid());
		if(productionworkplanPO != null){
			throw new FLException(220010, "该工序组已存在");
		}
		
		ProductionWorkPlanPO productionWorkPlanPO = new ProductionWorkPlanPO(new WorkplanPO(),new UserPO());
		BeanUtil.copyPropertie(productionWorkPlanVO, productionWorkPlanPO,Arrays.asList("workplan","creater"));
		BeanUtil.copyProperties(workplanDao.get(productionWorkPlanVO.getWorkplan().getWpid()), productionWorkPlanPO.getWorkplan());	
		productionWorkPlanPO.setCreater(userDao.queryUserByUserId(userId));
		productionWorkPlanPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		productionWorkPlanDao.save(productionWorkPlanPO);
		
	
		List<WorkflowPlanPO> workflowplans = workflowplanDao.queryWorkflowPlanByWpid(productionWorkPlanVO.getWorkplan().getWpid());
		if(workflowplans.size() == 0){
			throw new FLException(2200020, "工序组中暂无工序，请在该工序组中添加工序。");
		}
		for(WorkflowPlanPO workflowplan : workflowplans){
			ProductionWorkFlowPO productionWorkFlowPO = new ProductionWorkFlowPO(new WorkflowPO());			
			productionWorkFlowPO.setPwpid(productionWorkPlanPO.getPwpid());
			productionWorkFlowPO.setWorkflow(workflowDao.get(workflowplan.getWorkflow().getWfid()));
			productionworkflowDao.save(productionWorkFlowPO);			
		}
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteProductionWorkPlan(ProductionWorkPlanVO productionWorkPlanVO) throws FLException {
	
		ProductionWorkPlanPO productionworkplanPO = productionWorkPlanDao.queryProductionWorkPlanByPpidAWpid(productionWorkPlanVO.getPpid(), productionWorkPlanVO.getWorkplan().getWpid());
		if(productionworkplanPO == null){
			throw new FLException(220014, "计划工序组不存在");
		}
		if(productionworkplanPO.getStatus() == ProductionWorkPlanPO.STATUS_OPERATED_INT){
			throw new FLException(220011, "计划工序组状态不可操作");
		}
		//删除工序
		List<ProductionWorkFlowPO> productionWorkFlowPOs = productionworkflowDao.queryProductionWorkFlowByPwpid(productionworkplanPO.getPwpid());
		if(productionWorkFlowPOs.size() != 0){
			for(ProductionWorkFlowPO productionWorkFlowPO : productionWorkFlowPOs){
				productionworkflowDao.delete(productionWorkFlowPO);
			}
		}
		//最后删除工序组
		productionWorkPlanDao.delete(productionworkplanPO);
		
		return 0;
	}

}
