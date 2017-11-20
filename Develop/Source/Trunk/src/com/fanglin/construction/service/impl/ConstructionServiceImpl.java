/**
 * @File Name	: ConstructionServiceImpl.java
 * @Package   	: com.fanglin.service.impl.construction
 * @Version		: 1.0
 * @Date		: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.po.AcceptancePO;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.construction.service.ConstructionService;
import com.fanglin.construction.vo.ConstructionVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.CustomerVO;
import com.fanglin.data.common.vo.VillageVO;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.decoration.vo.DecorationOrderVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("constructionService")
@Transactional(readOnly=true)
public class ConstructionServiceImpl implements ConstructionService {
	
	@Autowired
	private ConstructionDao constructionDao;
	
	@Autowired
	private DecorationOrderDao decorationOrderDao;
	
	@Autowired
	private QuotationDao quotationDao;
	
	@Autowired
	private UserDao userDao;
	
	@Override
	public void pageDecorationOrderForConstruction(Paging paging, List<Filter> filters, Integer company){
		
		List<ConstructionPO> constructionPOs = constructionDao.pageConstruction(paging, filters, company);
		List<DecorationOrderVO> decorationOrderVOs = new ArrayList<DecorationOrderVO>();
		
		for(ConstructionPO constructionPO: constructionPOs){
			decorationOrderVOs.add(decorationOrderPOToVO(constructionPO.getDecorationOrderPO()));
		}
		
		paging.setData(decorationOrderVOs);
	}
	
	@Override
	public void pageDecorationOrderForSupervisionByUserId(Paging paging, List<Filter> filters, String userId, Integer company){
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO != null){
			filters.add(new Filter(ConstructionPO.COLUMN_SUPERVISORQUALITYID_STR, userId, "eq"));
		}
		
		List<ConstructionPO> constructionSchedulePOs = constructionDao.pageConstructionForSupervision(paging, filters, company);
		List<DecorationOrderVO> decorationOrderVOs = new ArrayList<DecorationOrderVO>();
		
		for(ConstructionPO constructionSchedulePO: constructionSchedulePOs){
			
			decorationOrderVOs.add(decorationOrderPOToVO(constructionSchedulePO.getDecorationOrderPO()));
		}
		
		paging.setData(decorationOrderVOs);
	}
	
	@Override
	public void pageDecorationOrderForAcceptance(Paging paging, List<Filter> filters, Integer company){
		
		String acceptanceFlagOp = null;
	
		for(Filter filter: filters){
			if(ConstructionPO.COLUMN_ACCEPTANCEFLAG_STR.equals(filter.getField())){
				String _flag = filter.getData();
				
				if("notAcceptanced".equals(_flag)){
					acceptanceFlagOp = "nand";
				}else{
					acceptanceFlagOp = "and";
				}
			}
		}
		
		filters.add(new Filter(ConstructionPO.COLUMN_ALLOCATIONWORKERFLAG_STR, String.valueOf(AcceptancePO.ACCEPTANCE_ALLOCATION_WORKER_FLAG_INT), acceptanceFlagOp));
		
		List<ConstructionPO> constructionPOs = constructionDao.pageConstructionForAcceptance(paging, filters, company);
		List<DecorationOrderVO> decorationOrderVOs = new ArrayList<DecorationOrderVO>();
		
		for(ConstructionPO constructionPO: constructionPOs){
			decorationOrderVOs.add(decorationOrderPOToVO(constructionPO.getDecorationOrderPO()));
		}
		
		paging.setData(decorationOrderVOs);
	}
	
	@Override
	public ConstructionVO queryConstructionById(int cid){
		
		ConstructionPO constructionPO = constructionDao.get(cid);
		ConstructionVO constructionVO = new ConstructionVO();
		
		BeanUtil.copyProperties(constructionPO, constructionVO);
		
		return constructionVO;
	}
	
	@Override
	public ConstructionVO queryConstructionByOrderId(ConstructionVO constructionVO){
		
		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(constructionVO.getOrderId());
		
		BeanUtil.copyProperties(constructionPO, constructionVO);
		
		return constructionVO;
	}
	
	@Override
	public ConstructionVO queryConstructionForWorkerNameByOrderId(ConstructionVO constructionVO){
		
		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(constructionVO.getOrderId());
		
		if(constructionPO != null){
		
			BeanUtil.copyProperties(constructionPO, constructionVO);
			
			if(constructionPO.getSupervisorQualityId() != null && !"".equals(constructionPO.getSupervisorQualityId())){
				UserPO supervisonQualityUser =  userDao.queryUserByUserId(constructionPO.getSupervisorQualityId());
				if(supervisonQualityUser != null){
					constructionVO.setSupervisorQualityName(supervisonQualityUser.getCurrentName());
				}
			}
		}
		
		return constructionVO;
	}
	
	//这个方法 看一下，没有用的地方可以删除了
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void saveOrUpdateConstruction(ConstructionVO constructionVO){
		
		ConstructionPO constructionPO = null;
		
		if(constructionVO.getCid() == 0){
			constructionPO = new ConstructionPO();
		}else{
			constructionPO = constructionDao.get(constructionVO.getCid());
		}
		BeanUtil.copyProperties(constructionVO, constructionPO);
		constructionDao.saveOrUpdate(constructionPO);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void saveOrUpdateConstructionByOrderId(ConstructionVO constructionVO){
		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(constructionVO.getOrderId());
		
		if(constructionPO == null){
			constructionPO = new ConstructionPO();
			constructionPO.setDecorationOrderPO(new DecorationOrderPO(constructionVO.getOrderId()));
			constructionPO.setSchedule(ConstructionPO.SCHEDULE_TYPE_CHAN_INT);
		}
		
		BeanUtil.copyProperties(constructionVO, constructionPO);
		constructionDao.saveOrUpdate(constructionPO);
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(constructionVO.getOrderId());
		if(decorationOrderPO != null){
			if(constructionVO.getSupervisorQualityId() != null){
				UserPO userPO = userDao.queryUserByUserId(constructionVO.getSupervisorQualityId());
				decorationOrderPO.setSupervisorPO(userPO);
			}else{
				decorationOrderPO.setSupervisorPO(null);
			}
			
			decorationOrderDao.update(decorationOrderPO);
		}
	}
	
	private DecorationOrderVO decorationOrderPOToVO(DecorationOrderPO decorationOrderPO){
		
		DecorationOrderVO decorationOrderVO = new DecorationOrderVO();
		BeanUtil.copyProperties(decorationOrderPO, decorationOrderVO);
		
		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(decorationOrderPO.getOrderId());
		
		if(decorationOrderVO.getOrderTotalPrice() == null || decorationOrderVO.getOrderTotalPrice() == 0){
			if(quotationPO == null){
				decorationOrderVO.setOrderTotalPrice(0f);
				decorationOrderVO.setDiscount(0f);
			}else{
				decorationOrderVO.setOrderTotalPrice(quotationPO.getTotalPrice());
				decorationOrderVO.setDiscount(quotationPO.getDiscount());
			}
		}
		
		if(quotationPO == null){
			decorationOrderVO.setDiscount(0f);
		}else{
			decorationOrderVO.setDiscount(quotationPO.getDiscount());
		}
		
		VillageVO villageVO = new VillageVO();
		CityProperVO cityProperVO = new CityProperVO();
		BeanUtil.copyProperties(decorationOrderPO.getVillagePO().getCityProper(), cityProperVO, Arrays.asList("city"));	
		BeanUtil.copyProperties(decorationOrderPO.getVillagePO(), villageVO, Arrays.asList("cityProper", "buildingNameRule"));
		villageVO.setCityProper(cityProperVO);
		decorationOrderVO.setVillage(villageVO);
		
		CustomerVO customerVO = new CustomerVO();
		BeanUtil.copyProperties(decorationOrderPO.getCustomerPO(), customerVO);
		decorationOrderVO.setCustomer(customerVO);
		
		UserPO supervisor = decorationOrderPO.getSupervisorPO();
		
		if(supervisor != null){
			decorationOrderVO.setSupervisor(supervisor.getCurrentName());
			decorationOrderVO.setSupervisorPhone(supervisor.getPhone());
		}
		
		UserPO designer = decorationOrderPO.getDesignerPO();
		
		decorationOrderVO.setDesigner(designer.getUserName());
		decorationOrderVO.setDesignerId(designer.getUserId());
		decorationOrderVO.setDesignerPhone(designer.getPhone());
		decorationOrderVO.setDesignDepartment(designer.getDept().getDeptName());
		
		UserPO salesman = decorationOrderPO.getSalesmanPO();
		
		decorationOrderVO.setSalesman(salesman.getUserName());
		decorationOrderVO.setSalesmanId(salesman.getUserId());
		decorationOrderVO.setSalesmanPhone(salesman.getPhone());
		decorationOrderVO.setBusinessDepartment(salesman.getDept().getDeptName());
			
		return decorationOrderVO;
	}
}
