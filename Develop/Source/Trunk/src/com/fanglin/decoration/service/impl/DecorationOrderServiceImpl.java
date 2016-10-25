/**
 * @File Name		: DecorationOrdereServiceImpl.java
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2014-7-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.dao.ServiceRecordDao;
import com.fanglin.common.po.CountingPO;
import com.fanglin.common.po.ServiceRecordPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.data.common.service.impl.CustomerServiceImpl;
import com.fanglin.data.common.vo.BuildingNameRuleVO;
import com.fanglin.data.common.vo.CustomerVO;
import com.fanglin.data.common.vo.VillageVO;
import com.fanglin.data.po.CustomerPO;
import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.data.po.VillagePO;
import com.fanglin.data.quotation.dao.QuotationVersionDao;
import com.fanglin.decoration.dao.DecorationBelongDao;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.dao.DecorationOrderOperateHistoryDao;
import com.fanglin.decoration.po.DecorationBelongInfoPO;
import com.fanglin.decoration.po.DecorationOrderOperateHistoryPO;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.decoration.service.DecorationOrderService;
import com.fanglin.decoration.vo.DecorationOrderExportVO;
import com.fanglin.decoration.vo.DecorationOrderVO;
import com.fanglin.department.po.DepartmentPO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.information.vo.MessageVO;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.po.AdvancePaymentPO;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.payment.po.DecorationReceiptPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaItemDao;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.report.service.DecorationRankService;
import com.fanglin.right.dao.DecorationOrderDesignDepartmentRightDao;
import com.fanglin.right.dao.DecorationOrderSalesmanDepartmentRightDao;
import com.fanglin.right.dao.DecorationOrderStatusRightDao;
import com.fanglin.right.po.DecorationOrderDesignDepartmentRightPO;
import com.fanglin.right.po.DecorationOrderSalesmanDepartmentRightPO;
import com.fanglin.right.po.DecorationOrderStatusRightPO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Constant;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Service("quotationOrderService")
@Transactional(readOnly=true)
public class DecorationOrderServiceImpl implements DecorationOrderService {

	protected Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private CountingService countingService;
	
	@Autowired
	private DecorationOrderDao decorationOrderDao;
	
	@Autowired
	private QuotationVersionDao quotationVersionDao;
	
	@Autowired
	private DecorationPaymentDao decorationPaymentDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private QuotationDao quotationDao;
	
	@Autowired
	private QuotationFunctionAreaDao quotationFunctionAreaDao;
	
	@Autowired
	private QuotationFunctionAreaItemDao quotationFunctionAreaItemDao;
	
	@Autowired
	private DecorationBelongDao orderBelongInfoDao;
	
	@Autowired
	private MessageService messageService;
	
	@Autowired
	private DecorationOrderOperateHistoryDao decorationOrderOperateHistoryDao;
	
	@Autowired
	private ServiceRecordDao serviceRecordDao;
	
	@Autowired
	private DecorationRankService decorationRankService;
	
	@Autowired
	private DecorationOrderDesignDepartmentRightDao decorationOrderDesignDepartmentRightDao;
	
	@Autowired
	private DecorationOrderSalesmanDepartmentRightDao decorationOrderSalesmanDepartmentRightDao;
	
	@Autowired
	private DecorationOrderStatusRightDao decorationOrderStatusRightDao;
	
	@Override
	public void pageDecorationOrderForGeneral(Paging paging, List<FilterVO> filters, String userId){
		
		if(filters.size() == 0) return ;
		
		UserPO userPO = userDao.get(userId);
		
		if(userPO == null) return;
		
		List<DecorationOrderPO> decorationOrderPOs = decorationOrderDao.pageDecorationOrderForGeneral(paging, filters);
		List<DecorationOrderVO> decorationOrderVOs = new ArrayList<DecorationOrderVO>();
		
		for(DecorationOrderPO decorationOrderPO: decorationOrderPOs){
			DecorationOrderVO decorationOrderVO = new DecorationOrderVO();
			BeanUtil.copyProperties(decorationOrderPO, decorationOrderVO);
			
			if(decorationOrderVO.getOrderTotalPrice() == null){
				decorationOrderVO.setOrderTotalPrice(new Float(0));
			}
			
			VillageVO villageVO = new VillageVO();
			CityProperVO cityProperVO = new CityProperVO();
			BeanUtil.copyProperties(decorationOrderPO.getVillagePO().getCityProper(), cityProperVO, Arrays.asList("city"));	
			BeanUtil.copyProperties(decorationOrderPO.getVillagePO(), villageVO, Arrays.asList("cityProper","buildingNameRule"));	
			villageVO.setCityProper(cityProperVO);
			decorationOrderVO.setVillage(villageVO);
			
			CustomerVO customerVO = new CustomerVO();
			BeanUtil.copyProperties(decorationOrderPO.getCustomerPO(), customerVO);
			CustomerServiceImpl.setCustomerBalance(decorationOrderPO.getCustomerPO(), customerVO);
			customerVO.setConfidentialInfo();
			decorationOrderVO.setCustomer(customerVO);
			
			UserPO designer = decorationOrderPO.getDesignerPO();
			
			decorationOrderVO.setDesigner(designer.getCurrentName());
			decorationOrderVO.setDesignerId(designer.getUserId());
			decorationOrderVO.setDesignerPhone(designer.getPhone());
			decorationOrderVO.setDesignDepartment(decorationOrderPO.getDesignerPO().getDept().getDeptName());
			
			if(decorationOrderPO.getDesignerPO().getDept().getFatherDept() != null){
				decorationOrderVO.setDesignRegion(decorationOrderPO.getDesignerPO().getDept().getFatherDept().getDeptName());
			}
			
			UserPO salesman = decorationOrderPO.getSalesmanPO();
			
			decorationOrderVO.setSalesman(salesman.getCurrentName());
			decorationOrderVO.setSalesmanId(salesman.getUserId());
			decorationOrderVO.setSalesmanPhone(salesman.getPhone());
			decorationOrderVO.setBusinessDepartment(decorationOrderPO.getSalesmanPO().getDept().getDeptName());
			
			decorationOrderVOs.add(decorationOrderVO);
		}
		
		paging.setData(decorationOrderVOs);
	}
	
	@Override
	public void pageDecorationOrderForCommon(Paging paging, List<FilterVO> filters, String userId){
		
		if(filters.size() == 0) return;
		
		UserPO userPO = userDao.get(userId);
		
		if(userPO == null) return;
		
		List<Integer> designDepartmentIds = null;
		List<String> statuses = null;
		
		List<DecorationOrderDesignDepartmentRightPO> decorationOrderDesignDepartmentRightPOs = decorationOrderDesignDepartmentRightDao.queryDecorationOrderDesignDepartmentRightByUId(userPO.getUid());
		
		designDepartmentIds = new ArrayList<Integer>();
		
		for(DecorationOrderDesignDepartmentRightPO decorationOrderDesignDepartmentRightPO: decorationOrderDesignDepartmentRightPOs){
			designDepartmentIds.add(decorationOrderDesignDepartmentRightPO.getDid());
		}
		
		List<DecorationOrderStatusRightPO> decorationOrderStatusRightPOs = decorationOrderStatusRightDao.queryDecorationOrderStatusRightByUId(userPO.getUid());
		
		statuses = new ArrayList<String>();
		
		for(DecorationOrderStatusRightPO decorationOrderStatusRightPO: decorationOrderStatusRightPOs){
			statuses.add(decorationOrderStatusRightPO.getStatus());
		}
		
		if(statuses.size() == 0 || designDepartmentIds.size() == 0){
			return;
		}
		
		List<DecorationOrderPO> decorationOrderPOs = decorationOrderDao.pageDecorationOrder(paging, filters, designDepartmentIds, statuses);
		List<DecorationOrderVO> decorationOrderVOs = new ArrayList<DecorationOrderVO>();
		
		for(DecorationOrderPO decorationOrderPO: decorationOrderPOs){
			DecorationOrderVO decorationOrderVO = new DecorationOrderVO();
			BeanUtil.copyProperties(decorationOrderPO, decorationOrderVO);
			
			QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(decorationOrderPO.getOrderId(), decorationOrderPO.getType());
			
			if(decorationOrderPO.getOrderTotalPrice() == null || decorationOrderPO.getOrderTotalPrice() == 0){
				if(quotationPO == null){
					decorationOrderVO.setOrderTotalPrice(0f);
				}else{
					decorationOrderVO.setOrderTotalPrice(quotationPO.getTotalPrice());
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
			customerVO.setConfidentialInfo();
			
			AdvancePaymentPO advancePaymentPO = decorationOrderPO.getCustomerPO().getAdvancePaymentPO();
			if(advancePaymentPO != null){
				customerVO.setBalance(advancePaymentPO.getBalance());
			}else{
				customerVO.setBalance(0f);
			}
			
			decorationOrderVO.setCustomer(customerVO);
			
			decorationOrderVO.setDesigner(decorationOrderPO.getDesignerPO().getCurrentName());
			decorationOrderVO.setDesignerId(decorationOrderPO.getDesignerPO().getUserId());
			decorationOrderVO.setDesignDepartment(decorationOrderPO.getDesignerPO().getDept().getDeptName());
			
			if(decorationOrderPO.getDesignerPO().getDept().getFatherDept() != null){ // 设置分区信息
				decorationOrderVO.setDesignRegion(decorationOrderPO.getDesignerPO().getDept().getFatherDept().getDeptName());
			}
			
			decorationOrderVO.setSalesman(decorationOrderPO.getSalesmanPO().getCurrentName());
			decorationOrderVO.setSalesmanId(decorationOrderPO.getSalesmanPO().getUserId());
			decorationOrderVO.setBusinessDepartment(decorationOrderPO.getSalesmanPO().getDept().getDeptName());
			
			List<DecorationBelongInfoPO> orderBelongInfoPOs = orderBelongInfoDao.queryOrderBelongInfoByOrderId(decorationOrderPO.getOrderId());
			
			for(DecorationBelongInfoPO orderBelongInfoPO: orderBelongInfoPOs){
				if(DecorationBelongInfoPO.BELONGTYPE_DESIGN_STR.equals(orderBelongInfoPO.getBelongType()) && !orderBelongInfoPO.getBelongUserPO().getUserId().equals(decorationOrderPO.getDesignerPO().getUserId())){ // 设计归属
					decorationOrderVO.setDesigner(decorationOrderVO.getDesigner() + Constant.SLASH + orderBelongInfoPO.getBelongUserPO().getUserName());
					decorationOrderVO.setDesignDepartment(decorationOrderVO.getDesignDepartment() + Constant.SLASH + orderBelongInfoPO.getBelongUserPO().getDept().getDeptName());
				}else if(DecorationBelongInfoPO.BELONGTYPE_SALESMAN_STR.equals(orderBelongInfoPO.getBelongType()) && !orderBelongInfoPO.getBelongUserPO().getUserId().equals(decorationOrderPO.getSalesmanPO().getUserId())){ // 业务归属
					decorationOrderVO.setSalesman(decorationOrderVO.getSalesman() + Constant.SLASH + orderBelongInfoPO.getBelongUserPO().getUserName());
					decorationOrderVO.setBusinessDepartment(decorationOrderVO.getBusinessDepartment() + Constant.SLASH + orderBelongInfoPO.getBelongUserPO().getDept().getDeptName());
				}
			}
			
			decorationOrderVOs.add(decorationOrderVO);
		}
		
		paging.setData(decorationOrderVOs);
	}
	
	@Override
	public void pageDecorationOrderForMaterial(Paging paging, List<FilterVO> filters, String userId){
		
		if(filters.size() == 0) return;
		
		UserPO userPO = userDao.get(userId);
		
		if(userPO == null) return;
		
		List<DecorationOrderPO> decorationOrderPOs = decorationOrderDao.pageDecorationOrderForMaterial(paging, filters);
		List<DecorationOrderVO> decorationOrderVOs = new ArrayList<DecorationOrderVO>();
		
		for(DecorationOrderPO decorationOrderPO: decorationOrderPOs){
			DecorationOrderVO decorationOrderVO = new DecorationOrderVO();
			BeanUtil.copyProperties(decorationOrderPO, decorationOrderVO);
			
			if(decorationOrderVO.getOrderTotalPrice() == null || decorationOrderVO.getOrderTotalPrice() == 0){
				
				QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(decorationOrderPO.getOrderId(), decorationOrderPO.getType());
				if(quotationPO == null){
					decorationOrderVO.setOrderTotalPrice(new Float(0));
				}else{
					decorationOrderVO.setOrderTotalPrice(quotationPO.getTotalPrice());
				}
			}
			
			VillageVO villageVO = new VillageVO();
			BeanUtil.copyProperties(decorationOrderPO.getVillagePO(), villageVO, Arrays.asList("cityProper", "buildingNameRule"));	
			decorationOrderVO.setVillage(villageVO);
			
			CustomerVO customerVO = new CustomerVO();
			BeanUtil.copyProperties(decorationOrderPO.getCustomerPO(), customerVO);
			customerVO.setConfidentialInfo();
			decorationOrderVO.setCustomer(customerVO);

			try {
				decorationOrderVO.setDesigner(decorationOrderPO.getDesignerPO().getCurrentName());
				decorationOrderVO.setDesignerId(decorationOrderPO.getDesignerPO().getUserId());
				decorationOrderVO.setDesignDepartment(decorationOrderPO.getDesignerPO().getDept().getDeptName());
				decorationOrderVO.setSalesman(decorationOrderPO.getSalesmanPO().getCurrentName());
				decorationOrderVO.setSalesmanId(decorationOrderPO.getSalesmanPO().getUserId());
				decorationOrderVO.setBusinessDepartment(decorationOrderPO.getSalesmanPO().getDept().getDeptName());
			} catch (Exception e){
				decorationOrderVO.setDesigner("-");
				decorationOrderVO.setDesignerId("-");
				decorationOrderVO.setDesignDepartment("-");
				decorationOrderVO.setSalesman("-");
				decorationOrderVO.setSalesmanId("-");
				decorationOrderVO.setBusinessDepartment("-");
			}
			
			decorationOrderVO.setHouseNumber(decorationOrderPO.getHouseNumber());
			
			if(decorationOrderPO.getSupervisorPO() != null){
				decorationOrderVO.setSupervisor(decorationOrderPO.getSupervisorPO().getCurrentName());
			}
			
			decorationOrderVOs.add(decorationOrderVO);
		}
	
		paging.setData(decorationOrderVOs);
	}
	
	@Override
	public int queryDecorationOrderForCondition(String userId){
		
		int condition = 0;
		
		UserPO userPO = userDao.get(userId);
		
		if(userPO.getDuty().contains("设计部总监")){
			condition = SystemConfig.getInt("majordomoCondition", 0);
		}else if(userPO.getDuty().contains("设计部经理")){
			condition = SystemConfig.getInt("managerCondition", 0);
		}else if(userPO.getDuty().contains("设计师")){
			condition = SystemConfig.getInt("designerCondition", 0);
		}else if(userPO.getDuty().contains("总经理")){
			condition = SystemConfig.getInt("generalCondition", 0);
		}else if(userPO.getDuty().contains("系统工程师")){
			condition = SystemConfig.getInt("allCondition", 0);
		}else if(userPO.getDuty().contains("主材组长")){
			condition = SystemConfig.getInt("materialCondition", 0);
		}else{
			condition = SystemConfig.getInt("commonCondition", 0);
		}
		
		return condition;
	}

	@Override
	public void pageDecorationOrderForBelong(Paging paging, List<FilterVO> filters, String userId){
		
		if(filters.size() == 0) return;
		
		UserPO userPO = userDao.get(userId);
		
		if(userPO == null) return;
		
		List<String> statuses = Arrays.asList(DecorationOrderPO.STATUS_SIGNED_STR, DecorationOrderPO.STATUS_WASTE_STR, DecorationOrderPO.STATUS_TERMINATION_STR, DecorationOrderPO.STATUS_COMPLETED_STR);
		
		filters.add(new FilterVO("statuses", statuses, "ni"));
		
		List<DecorationOrderPO> decorationOrderPOs = decorationOrderDao.pageDecorationOrder(paging, filters, null, null);
		List<DecorationOrderVO> decorationOrderVOs = new ArrayList<DecorationOrderVO>();
		
		for(DecorationOrderPO decorationOrderPO: decorationOrderPOs){
			DecorationOrderVO decorationOrderVO = new DecorationOrderVO();
			BeanUtil.copyProperties(decorationOrderPO, decorationOrderVO);
			
			if(decorationOrderVO.getOrderTotalPrice() == null){
				decorationOrderVO.setOrderTotalPrice(new Float(0));
			}
			
			VillageVO villageVO = new VillageVO();
			CityProperVO cityProperVO = new CityProperVO();
			BeanUtil.copyProperties(decorationOrderPO.getVillagePO().getCityProper(), cityProperVO, Arrays.asList("city"));	
			BeanUtil.copyProperties(decorationOrderPO.getVillagePO(), villageVO, Arrays.asList("cityProper","buildingNameRule"));	
			villageVO.setCityProper(cityProperVO);
			decorationOrderVO.setVillage(villageVO);
			
			CustomerVO customerVO = new CustomerVO();
			BeanUtil.copyProperties(decorationOrderPO.getCustomerPO(), customerVO);
			customerVO.setConfidentialInfo();
			decorationOrderVO.setCustomer(customerVO);
			
			decorationOrderVO.setDesigner(decorationOrderPO.getDesignerPO().getCurrentName());
			decorationOrderVO.setDesignerId(decorationOrderPO.getDesignerPO().getUserId());
			decorationOrderVO.setDesignDepartment(decorationOrderPO.getDesignerPO().getDept().getDeptName());
			
			decorationOrderVO.setSalesman(decorationOrderPO.getSalesmanPO().getCurrentName());
			decorationOrderVO.setSalesmanId(decorationOrderPO.getSalesmanPO().getUserId());
			decorationOrderVO.setBusinessDepartment(decorationOrderPO.getSalesmanPO().getDept().getDeptName());
			
			decorationOrderVOs.add(decorationOrderVO);
		}
		
		paging.setData(decorationOrderVOs);
	}
	
	@Override
	public void pageDecorationOrderForDesigner(Paging paging, List<FilterVO> filters, String userId){
		
		UserPO userPO = userDao.get(userId);
		
		if(userPO == null) return;
		
		String duty = userPO.getDuty();
		
		if(filters.size() == 0 && !duty.contains("设计师")) return;
		
		List<Integer> designDepartmentIds = null;
		List<String> statuses = null;
		
		if(duty.contains("设计师")){
			filters.add(new FilterVO("designerId", userPO.getUserId(), "eq"));
		}else{
			List<DecorationOrderDesignDepartmentRightPO> decorationOrderDesignDepartmentRightPOs = decorationOrderDesignDepartmentRightDao.queryDecorationOrderDesignDepartmentRightByUId(userPO.getUid());
			
			designDepartmentIds = new ArrayList<Integer>();
			
			for(DecorationOrderDesignDepartmentRightPO decorationOrderDesignDepartmentRightPO: decorationOrderDesignDepartmentRightPOs){
				designDepartmentIds.add(decorationOrderDesignDepartmentRightPO.getDid());
			}
			
			List<DecorationOrderStatusRightPO> decorationOrderStatusRightPOs = decorationOrderStatusRightDao.queryDecorationOrderStatusRightByUId(userPO.getUid());
			
			statuses = new ArrayList<String>();
			
			for(DecorationOrderStatusRightPO decorationOrderStatusRightPO: decorationOrderStatusRightPOs){
				statuses.add(decorationOrderStatusRightPO.getStatus());
			}
			
			if(statuses.size() == 0 || designDepartmentIds.size() == 0){
				return;
			}
		}
		
		List<DecorationOrderPO> decorationOrderPOs = decorationOrderDao.pageDecorationOrderForDesign(paging, filters, designDepartmentIds, statuses);
		List<DecorationOrderVO> decorationOrderVOs = new ArrayList<DecorationOrderVO>();
		
		for(DecorationOrderPO decorationOrderPO: decorationOrderPOs){
			DecorationOrderVO decorationOrderVO = new DecorationOrderVO();
			BeanUtil.copyProperties(decorationOrderPO, decorationOrderVO);
			
			QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(decorationOrderPO.getOrderId(), decorationOrderPO.getType());
			
			if(decorationOrderPO.getOrderTotalPrice() == null || decorationOrderPO.getOrderTotalPrice() == 0){
				if(quotationPO == null){
					decorationOrderVO.setOrderTotalPrice(0f);
				}else{
					decorationOrderVO.setOrderTotalPrice(quotationPO.getTotalPrice());
				}
			}
			
			VillageVO villageVO = new VillageVO();
			CityProperVO cityProperVO = new CityProperVO();
			BeanUtil.copyProperties(decorationOrderPO.getVillagePO().getCityProper(), cityProperVO, Arrays.asList("city"));	
			BeanUtil.copyProperties(decorationOrderPO.getVillagePO(), villageVO, Arrays.asList("cityProper", "buildingNameRule"));	
			villageVO.setCityProper(cityProperVO);
			decorationOrderVO.setVillage(villageVO);
			
			CustomerVO customerVO = new CustomerVO();
			BeanUtil.copyProperties(decorationOrderPO.getCustomerPO(), customerVO);
			customerVO.setConfidentialInfo();
			
			AdvancePaymentPO advancePaymentPO = decorationOrderPO.getCustomerPO().getAdvancePaymentPO();
			if(advancePaymentPO != null){
				customerVO.setBalance(advancePaymentPO.getBalance());
			}else{
				customerVO.setBalance(0f);
			}
			
			decorationOrderVO.setCustomer(customerVO);
			
			decorationOrderVO.setDesigner(decorationOrderPO.getDesignerPO().getCurrentName());
			decorationOrderVO.setDesignerId(decorationOrderPO.getDesignerPO().getUserId());
			decorationOrderVO.setDesignDepartment(decorationOrderPO.getDesignerPO().getDept().getDeptName());
			
			decorationOrderVO.setSalesman(decorationOrderPO.getSalesmanPO().getCurrentName());
			decorationOrderVO.setSalesmanId(decorationOrderPO.getSalesmanPO().getUserId());
			decorationOrderVO.setBusinessDepartment(decorationOrderPO.getSalesmanPO().getDept().getDeptName());
			
			List<DecorationBelongInfoPO> orderBelongInfoPOs = orderBelongInfoDao.queryOrderBelongInfoByOrderId(decorationOrderPO.getOrderId());
			
			for(DecorationBelongInfoPO orderBelongInfoPO: orderBelongInfoPOs){
				if(DecorationBelongInfoPO.BELONGTYPE_DESIGN_STR.equals(orderBelongInfoPO.getBelongType()) && !orderBelongInfoPO.getBelongUserPO().getUserId().equals(decorationOrderPO.getDesignerPO().getUserId())){
					decorationOrderVO.setDesigner(decorationOrderVO.getDesigner() + Constant.SLASH + orderBelongInfoPO.getBelongUserPO().getUserName());
					decorationOrderVO.setDesignDepartment(decorationOrderVO.getDesignDepartment() + Constant.SLASH + orderBelongInfoPO.getBelongUserPO().getDept().getDeptName());
				}else if(DecorationBelongInfoPO.BELONGTYPE_SALESMAN_STR.equals(orderBelongInfoPO.getBelongType()) && !orderBelongInfoPO.getBelongUserPO().getUserId().equals(decorationOrderPO.getSalesmanPO().getUserId())){
					decorationOrderVO.setSalesman(decorationOrderVO.getSalesman() + Constant.SLASH + orderBelongInfoPO.getBelongUserPO().getUserName());
					decorationOrderVO.setBusinessDepartment(decorationOrderVO.getBusinessDepartment() + Constant.SLASH + orderBelongInfoPO.getBelongUserPO().getDept().getDeptName());
				}
			}
			
			decorationOrderVOs.add(decorationOrderVO);
		}
	
		paging.setData(decorationOrderVOs);
	}
	
	@Override
	public void pageDecorationOrderForSalesman(Paging paging, List<FilterVO> filters, String userId){
		
		if(filters.size() == 0) return;
		
		UserPO userPO = userDao.get(userId);
		
		if(userPO == null) return;
		
		String duty = userPO.getDuty();
		
		List<Integer> salesmanDepartmentIds = null;
		List<String> statuses = null;
		
		if(duty.contains("业务员")){
			filters.add(new FilterVO("userSalesman", userPO.getUserId(), "eq"));
		}else{
			List<DecorationOrderSalesmanDepartmentRightPO> decoratoinOrderSalesmanDepartmentRightPOs = decorationOrderSalesmanDepartmentRightDao.queryDecorationOrderSalesmanDepartmentRightByUId(userPO.getUid());
			
			salesmanDepartmentIds = new ArrayList<Integer>();
			
			for(DecorationOrderSalesmanDepartmentRightPO decorationOrderSalesmanDepartmentRightPO: decoratoinOrderSalesmanDepartmentRightPOs){
				salesmanDepartmentIds.add(decorationOrderSalesmanDepartmentRightPO.getDid());
			}
			
			List<DecorationOrderStatusRightPO> decorationOrderStatusRightPOs = decorationOrderStatusRightDao.queryDecorationOrderStatusRightByUId(userPO.getUid());
			
			statuses = new ArrayList<String>();
			
			for(DecorationOrderStatusRightPO decorationOrderStatusRightPO: decorationOrderStatusRightPOs){
				statuses.add(decorationOrderStatusRightPO.getStatus());
			}
			
			if(statuses.size() == 0 || salesmanDepartmentIds.size() == 0){
				return;
			}
		}
		
		List<DecorationOrderPO> decorationOrderPOs = decorationOrderDao.pageDecorationOrderForSalesman(paging, filters, salesmanDepartmentIds, statuses);
		List<DecorationOrderVO> decorationOrderVOs = new ArrayList<DecorationOrderVO>();
		
		for(DecorationOrderPO decorationOrderPO: decorationOrderPOs){
			DecorationOrderVO decorationOrderVO = new DecorationOrderVO();
			BeanUtil.copyProperties(decorationOrderPO, decorationOrderVO);
			if(decorationOrderVO.getOrderTotalPrice() == null){
				decorationOrderVO.setOrderTotalPrice(new Float(0));
			}
			
			QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(decorationOrderPO.getOrderId(), decorationOrderPO.getType());
			
			if(decorationOrderPO.getOrderTotalPrice() == null || decorationOrderPO.getOrderTotalPrice() == 0){
				if(quotationPO == null){
					decorationOrderVO.setOrderTotalPrice(0f);
				}else{
					decorationOrderVO.setOrderTotalPrice(quotationPO.getTotalPrice());
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
			BeanUtil.copyProperties(decorationOrderPO.getVillagePO(), villageVO, Arrays.asList("cityProper","buildingNameRule"));	
			villageVO.setCityProper(cityProperVO);
			decorationOrderVO.setVillage(villageVO);
			
			CustomerVO customerVO = new CustomerVO();
			BeanUtil.copyProperties(decorationOrderPO.getCustomerPO(), customerVO);
			customerVO.setConfidentialInfo();
			decorationOrderVO.setCustomer(customerVO);
			
			decorationOrderVO.setDesigner(decorationOrderPO.getDesignerPO().getCurrentName());
			decorationOrderVO.setDesignerId(decorationOrderPO.getDesignerPO().getUserId());
			decorationOrderVO.setDesignDepartment(decorationOrderPO.getDesignerPO().getDept().getDeptName());
			
			decorationOrderVO.setSalesman(decorationOrderPO.getSalesmanPO().getCurrentName());
			decorationOrderVO.setSalesmanId(decorationOrderPO.getSalesmanPO().getUserId());
			decorationOrderVO.setBusinessDepartment(decorationOrderPO.getSalesmanPO().getDept().getDeptName());
			
			decorationOrderVOs.add(decorationOrderVO);
		}
	
		paging.setData(decorationOrderVOs);
	}
	
	@Override
	public DecorationOrderVO queryDecorationOrderById(String decorationOrderId) throws FLException{
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(decorationOrderId);
		
		if(decorationOrderPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		DecorationOrderVO decorationOrderVO = new DecorationOrderVO();
		
		BeanUtil.copyProperties(decorationOrderPO, decorationOrderVO);
		
		VillageVO villageVO = new VillageVO();
		BeanUtil.copyProperties(decorationOrderPO.getVillagePO(), villageVO, Arrays.asList("cityProper", "buildingNameRule"));
		villageVO.setBuildingNameRule(new BuildingNameRuleVO());
        BeanUtil.copyProperties(decorationOrderPO.getVillagePO().getBuildingNameRule(), villageVO.getBuildingNameRule());  
		
		CityProperVO cityProperVO = new CityProperVO();
		BeanUtil.copyProperties(decorationOrderPO.getVillagePO().getCityProper(), cityProperVO, Arrays.asList("city"));	
		villageVO.setCityProper(cityProperVO);
		decorationOrderVO.setVillage(villageVO);
		
		CustomerVO customerVO = new CustomerVO();
		BeanUtil.copyProperties(decorationOrderPO.getCustomerPO(), customerVO);
		decorationOrderVO.setCustomer(customerVO);
		
		decorationOrderVO.setVersionId(decorationOrderPO.getVersionPO().getVersionId());
		decorationOrderVO.setVersionName(decorationOrderPO.getVersionPO().getVersionName());
		
		decorationOrderVO.setDesigner(decorationOrderPO.getDesignerPO().getCurrentName());
		decorationOrderVO.setDesignerId(decorationOrderPO.getDesignerPO().getUserId());
		decorationOrderVO.setDesignDepartment(decorationOrderPO.getDesignerPO().getDept().getDeptName());
		
		decorationOrderVO.setSalesman(decorationOrderPO.getSalesmanPO().getCurrentName());
		decorationOrderVO.setSalesmanId(decorationOrderPO.getSalesmanPO().getUserId());
		decorationOrderVO.setBusinessDepartment(decorationOrderPO.getSalesmanPO().getDept().getDeptName());
		
		if(decorationOrderVO.getContractCode() == null){
			String startWith = SystemConfig.getString("contractStartWith", "FLJ-");
			decorationOrderVO.setContractCode(startWith + decorationOrderVO.getOrderId() + "-" + decorationOrderPO.getDesignerPO().getDept().getContractPrefix());
		}
		
		if(decorationOrderVO.getOrderTotalPrice() == null || decorationOrderVO.getOrderTotalPrice() == 0){
			
			QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(decorationOrderPO.getOrderId(), decorationOrderPO.getType());
			if(quotationPO == null){
				decorationOrderVO.setOrderTotalPrice(new Float(0));
			}else{
				decorationOrderVO.setOrderTotalPrice(quotationPO.getTotalPrice());
			}
		}
		
		return decorationOrderVO;
	}

	@Override
	public List<DecorationOrderExportVO> queryDecorationOrderForComplete(List<FilterVO> filters) {
		
		List<DecorationOrderPO> decorationOrderPOs = decorationOrderDao.queryDecorationOrder(filters);
		
		List<DecorationOrderExportVO> decorationOrderExportVOs = new ArrayList<DecorationOrderExportVO>();
		
		if(decorationOrderPOs.size() == 0){
			return decorationOrderExportVOs;
		}
		
		List<String> orderIds = new ArrayList<String>();
		Map<String, DecorationOrderPO> decorationOrderMap = new HashMap<String, DecorationOrderPO>();
		Map<String, DecorationOrderExportVO> decorationOrderExportMap = new HashMap<String, DecorationOrderExportVO>();
		
		for(DecorationOrderPO decorationOrderPO: decorationOrderPOs){
			String orderId = decorationOrderPO.getOrderId();
			
			DecorationOrderExportVO decorationOrderExportVO = new DecorationOrderExportVO();
			
			decorationOrderExportVO.setOrderId(decorationOrderPO.getOrderId());
			decorationOrderExportVO.setOrderAddr(decorationOrderPO.getVillagePO().getVillageName() + " " + decorationOrderPO.getHouseNumber());
			decorationOrderExportVO.setContractTime(decorationOrderPO.getContractTime());
			decorationOrderExportVO.setNotSalesmanRate(decorationOrderPO.getNotSalesmanRate());
			decorationOrderExportVO.setContractPrice(decorationOrderPO.getOrderTotalPrice());
			decorationOrderExportVO.setUnpayPayment(decorationOrderPO.getOrderTotalPrice());
			decorationOrderExportVO.setSalesmanType(decorationOrderPO.getSalesmanType());
			decorationOrderExportVO.setHouseArea(decorationOrderPO.getHouseArea());
			
			if(decorationOrderPO.getSupervisorPO() != null){
				decorationOrderExportVO.setSupervisor(decorationOrderPO.getSupervisorPO().getCurrentName());
			}
			
			AdvancePaymentPO advancePaymentPO = decorationOrderPO.getCustomerPO().getAdvancePaymentPO();
			if(advancePaymentPO != null){
				decorationOrderExportVO.setAdvancePayment(advancePaymentPO.getBalance());
			}else{
				decorationOrderExportVO.setAdvancePayment(0f);
			}
			
			if(DecorationOrderPO.STATUS_WASTE_STR.equals(decorationOrderPO.getStatus())){
				decorationOrderExportVO.setGiveup(decorationOrderPO.getStatus());
			}else{
				decorationOrderExportVO.setGiveup("");
			}
			
			orderIds.add(orderId);
			decorationOrderMap.put(orderId, decorationOrderPO);
			decorationOrderExportMap.put(orderId, decorationOrderExportVO);
		}
		
		List<QuotationPO> quotationPOs = quotationDao.queryQuotationForDefaultByOrderIds(orderIds);
		
		for(QuotationPO quotationPO: quotationPOs){
			
			if(quotationPO.getType() != quotationPO.getDecorationOrder().getType()) continue;
			
			DecorationOrderExportVO decorationOrderExportVO = decorationOrderExportMap.get(quotationPO.getDecorationOrder().getOrderId());
			
			decorationOrderExportVO.setDiscount(quotationPO.getDiscount());
			decorationOrderExportVO.setLatexCut(quotationPO.getLatexCut());
			decorationOrderExportVO.setManageRate(quotationPO.getManageRate());
			decorationOrderExportVO.setManagePrice(quotationPO.getManagePrice());
			decorationOrderExportVO.setTrafficPrice(quotationPO.getTrafficPrice());
			
			if(quotationPO.getManageRate() == 0){
				decorationOrderExportVO.setNotSalesmanCut(0);
				decorationOrderExportVO.setAchievement(0);
			}else{
				decorationOrderExportVO.setNotSalesmanCut((float) Arith.mul(Arith.div(quotationPO.getManagePrice(), quotationPO.getManageRate()), decorationOrderExportVO.getNotSalesmanRate()));
				decorationOrderExportVO.setAchievement(Arith.sub(decorationOrderExportVO.getContractPrice(), decorationOrderExportVO.getNotSalesmanCut()));
			}
		}
		
		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryDecorationPaymentByOrderIds(orderIds);
		
		for(DecorationPaymentPO decorationPaymentPO: decorationPaymentPOs){
			DecorationOrderExportVO decorationOrderExportVO = decorationOrderExportMap.get(decorationPaymentPO.getDecorationOrderPO().getOrderId());
			
			DecorationReceiptPO decorationReceiptPO = decorationPaymentPO.getDecorationReceipt();
			
			if(DecorationPaymentPO.PAYMENTTYPE_FIRST_STR.equals(decorationPaymentPO.getPaymentType())){
				decorationOrderExportVO.setFirstPayment(decorationPaymentPO.getReferMoney());
				
				if(decorationReceiptPO != null){
					decorationOrderExportVO.setFirstCollectTime(decorationReceiptPO.getCollectTime());
	
					if(decorationReceiptPO.getCollectTime() != null){
						decorationOrderExportVO.setUnpayPayment(Arith.sub(decorationOrderExportVO.getUnpayPayment(), decorationPaymentPO.getReferMoney()));
					}
				}
			}else if(DecorationPaymentPO.PAYMENTTYPE_FIRST_SECOND_STR.equals(decorationPaymentPO.getPaymentType())){
				decorationOrderExportVO.setFirstSecondPayment(decorationPaymentPO.getReferMoney());
				
				if(decorationReceiptPO != null){
					decorationOrderExportVO.setFirstSecondCollectTime(decorationReceiptPO.getCollectTime());
					
					if(decorationReceiptPO.getCollectTime() != null){
						decorationOrderExportVO.setUnpayPayment(Arith.sub(decorationOrderExportVO.getUnpayPayment(), decorationPaymentPO.getReferMoney()));
					}
				}
			}else if(DecorationPaymentPO.PAYMENTTYPE_SECOND_STR.equals(decorationPaymentPO.getPaymentType())){
				decorationOrderExportVO.setSecondPayment(decorationPaymentPO.getReferMoney());
				
				if(decorationReceiptPO != null){
					decorationOrderExportVO.setSecondCollectTime(decorationReceiptPO.getCollectTime());
					
					if(decorationReceiptPO.getCollectTime() != null){
						decorationOrderExportVO.setUnpayPayment(Arith.sub(decorationOrderExportVO.getUnpayPayment(), decorationPaymentPO.getReferMoney()));
					}
				}
			}else if(DecorationPaymentPO.PAYMENTTYPE_FINAL_STR.equals(decorationPaymentPO.getPaymentType())){
				decorationOrderExportVO.setThirdPayment(decorationPaymentPO.getReferMoney());
				
				if(decorationReceiptPO != null){
					decorationOrderExportVO.setThirdCollectTime(decorationReceiptPO.getCollectTime());
					
					if(decorationReceiptPO.getCollectTime() != null){
						decorationOrderExportVO.setUnpayPayment(Arith.sub(decorationOrderExportVO.getUnpayPayment(), decorationPaymentPO.getReferMoney()));
					}
				}
			}else if(DecorationPaymentPO.PAYMENTTYPE_PENALTY_STR.equals(decorationPaymentPO.getPaymentType())){
				decorationOrderExportVO.setPenalty(decorationPaymentPO.getReferMoney());
			}else if(DecorationPaymentPO.PAYMENTTYPE_DESIGN_STR.equals(decorationPaymentPO.getPaymentType())){
				decorationOrderExportVO.setDesignPayment(decorationPaymentPO.getReferMoney());
				decorationOrderExportVO.setDesignPaymentStatus(decorationPaymentPO.getPaymentStatus());
			}
		}
		
		List<DecorationBelongInfoPO> orderBelongInfoPOs = orderBelongInfoDao.queryOrderBelongInfoByOrderIds(orderIds);
		
		for(DecorationBelongInfoPO orderBelongInfoPO: orderBelongInfoPOs){
			
			try {
				DecorationOrderExportVO decorationOrderExportVO = (DecorationOrderExportVO) decorationOrderExportMap.get(orderBelongInfoPO.getDecorationOrderPO().getOrderId()).clone();
				
				UserPO belongUserPO = orderBelongInfoPO.getBelongUserPO();
				DepartmentPO departmentPO = orderBelongInfoPO.getBelongDeptPO();
				DepartmentPO regionPO = orderBelongInfoPO.getBelongRegionPO();
				
				decorationOrderExportVO.setUserId(belongUserPO.getUserId());
				decorationOrderExportVO.setOperateUserId(belongUserPO.getOldUserId());
				decorationOrderExportVO.setOperateUserName(belongUserPO.getCurrentName());
				
				if(departmentPO != null){
					decorationOrderExportVO.setDepartmentId(departmentPO.getDeptId());
					decorationOrderExportVO.setDepartment(departmentPO.getDeptName());
				}else{
					decorationOrderExportVO.setDepartmentId("");
					decorationOrderExportVO.setDepartment("");
				}
				
				if(regionPO != null){
					decorationOrderExportVO.setRegionId(regionPO.getDeptId());
					decorationOrderExportVO.setRegion(regionPO.getDeptName());
				}else{
					decorationOrderExportVO.setRegionId("");
					decorationOrderExportVO.setRegion("");
				}
				
				decorationOrderExportVO.setRate(orderBelongInfoPO.getBelongRate());
				decorationOrderExportVO.setOperateType(orderBelongInfoPO.getBelongType());
				
				if(orderBelongInfoPO.getBelongRate() < 1){
					decorationOrderExportVO.setMerge("合尺");
				}else{
					decorationOrderExportVO.setMerge("");
				}
				
				decorationOrderExportVOs.add(decorationOrderExportVO);
			} catch (CloneNotSupportedException e) {
				e.printStackTrace();
			}
		}
		
		return decorationOrderExportVOs;
	}

	@Override
	public DecorationOrderVO queryDecorationOrderForCommonByOrderId(DecorationOrderVO decorationOrderVO, String userId) throws FLException{
		
		List<String> unstatus = Arrays.asList(new String[]{DecorationOrderPO.STATUS_SIGNED_STR, DecorationOrderPO.STATUS_TERMINATION_STR, DecorationOrderPO.STATUS_COMPLETED_STR});
		
		decorationOrderVO = queryDecorationOrderById(decorationOrderVO.getOrderId());
		
		String status = decorationOrderVO.getStatus();
		
		if(!unstatus.contains(status)){
			
			UserPO userPO = userDao.get(userId);
			
			if(userPO != null && !userPO.getDept().getDeptName().contains("客服")){
				decorationOrderVO.getCustomer().setConfidentialInfo();
			}
		}
		
		return decorationOrderVO;
	}
	
	@Override
	public DecorationOrderVO queryDecorationOrderForDesignerByOrderId(DecorationOrderVO decorationOrderVO, String userId) throws FLException{
		
		List<String> unstatus = Arrays.asList(new String[]{DecorationOrderPO.STATUS_SIGNED_STR, DecorationOrderPO.STATUS_TERMINATION_STR, DecorationOrderPO.STATUS_COMPLETED_STR});
		List<String> checkInfoDutys = Arrays.asList("设计部经理", "设计师");
		
		decorationOrderVO = queryDecorationOrderById(decorationOrderVO.getOrderId());
		
		String status = decorationOrderVO.getStatus();
		
		if(!unstatus.contains(status)){
			
			UserPO userPO = userDao.get(userId);
			
			if(!checkInfoDutys.contains(userPO.getDuty())){
				decorationOrderVO.getCustomer().setConfidentialInfo();
			}
		}
		
		return decorationOrderVO;
	}
	
	@Override
	public DecorationOrderVO queryDecorationOrderByVillageIdAHouseNumber(DecorationOrderVO decorationOrderVO){
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByVillageIdAHouseNumber(decorationOrderVO.getVillage().getVillageId(), decorationOrderVO.getHouseNumber());
		
		if(decorationOrderPO == null){
			return null;
		}
		
		BeanUtil.copyProperties(decorationOrderPO, decorationOrderVO);
		
		VillageVO villageVO = new VillageVO();
		CityProperVO cityProperVO = new CityProperVO();
		BeanUtil.copyProperties(decorationOrderPO.getVillagePO().getCityProper(), cityProperVO, Arrays.asList("city"));	
		BeanUtil.copyProperties(decorationOrderPO.getVillagePO(), villageVO, Arrays.asList("cityProper","buildingNameRule"));	
		villageVO.setCityProper(cityProperVO);
		decorationOrderVO.setVillage(villageVO);
		
		CustomerVO customerVO = new CustomerVO();
		BeanUtil.copyProperties(decorationOrderPO.getCustomerPO(), customerVO);
		customerVO.setConfidentialInfo();
		decorationOrderVO.setCustomer(customerVO);
		
		decorationOrderVO.setDesigner(decorationOrderPO.getDesignerPO().getCurrentName());
		decorationOrderVO.setDesignerId(decorationOrderPO.getDesignerPO().getUserId());
		
		decorationOrderVO.setSalesman(decorationOrderPO.getSalesmanPO().getCurrentName());
		decorationOrderVO.setSalesmanId(decorationOrderPO.getSalesmanPO().getUserId());
		
		return decorationOrderVO;
	}
	
	@Override
	public DecorationOrderVO queryDecorationOrderForSignedByCustomerId(DecorationOrderVO decorationOrderVO){
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByCustomer(decorationOrderVO.getCustomer().getId());
		
		if(decorationOrderPO == null){
			return null;
		}
		
		BeanUtil.copyProperties(decorationOrderPO, decorationOrderVO);
		
		VillageVO villageVO = new VillageVO();
		CityProperVO cityProperVO = new CityProperVO();
		BeanUtil.copyProperties(decorationOrderPO.getVillagePO().getCityProper(), cityProperVO, Arrays.asList("city"));	
		BeanUtil.copyProperties(decorationOrderPO.getVillagePO(), villageVO, Arrays.asList("cityProper","buildingNameRule"));	
		villageVO.setCityProper(cityProperVO);
		decorationOrderVO.setVillage(villageVO);
		
		CustomerVO customerVO = new CustomerVO();
		BeanUtil.copyProperties(decorationOrderPO.getCustomerPO(), customerVO);
		customerVO.setConfidentialInfo();
		decorationOrderVO.setCustomer(customerVO);
		
		decorationOrderVO.setDesigner(decorationOrderPO.getDesignerPO().getCurrentName());
		decorationOrderVO.setDesignerId(decorationOrderPO.getDesignerPO().getUserId());
		
		decorationOrderVO.setSalesman(decorationOrderPO.getSalesmanPO().getCurrentName());
		decorationOrderVO.setSalesmanId(decorationOrderPO.getSalesmanPO().getUserId());
		
		return decorationOrderVO;
	}
	
	@Override
	public void checkDecorationOrderExist(DecorationOrderVO decorationOrderVO){
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(decorationOrderVO.getOrderId());
		
		if(decorationOrderPO != null){
			decorationOrderVO.setAutoId(decorationOrderPO.getAutoId());
			
			BeanUtil.copyProperties(decorationOrderPO, decorationOrderVO);
			
			VillageVO villageVO = new VillageVO();
			CityProperVO cp = new CityProperVO();
			BeanUtil.copyProperties(decorationOrderPO.getVillagePO().getCityProper(), cp, Arrays.asList("city"));	
			BeanUtil.copyProperties(decorationOrderPO.getVillagePO(), villageVO, Arrays.asList("cityProper","buildingNameRule"));	
			villageVO.setCityProper(cp);
			decorationOrderVO.setVillage(villageVO);
			
			CustomerVO customerVO = new CustomerVO();
			BeanUtil.copyProperties(decorationOrderPO.getCustomerPO(), customerVO);
			customerVO.setConfidentialInfo();
			decorationOrderVO.setCustomer(customerVO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int changeDecorationOrderForAdvance(DecorationOrderVO decorationOrderVO) throws FLException{
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(decorationOrderVO.getOrderId());
		
		List<String> status = Arrays.asList(new String[]{DecorationOrderPO.STATUS_CONSULT_STR, DecorationOrderPO.STATUS_AMOUNT_STR, DecorationOrderPO.STATUS_QUOTATION_STR, DecorationOrderPO.STATUS_DEPOSIT_STR, DecorationOrderPO.STATUS_RESIGNED_STR}); // 咨询, 量房, 已报价, 定金, 重签合同
		
		if(decorationOrderPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		if(status.contains(decorationOrderPO.getStatus())){
			
			decorationOrderPO.setHouseType(decorationOrderVO.getHouseType());
			decorationOrderPO.setHouseArea(decorationOrderVO.getHouseArea());
			decorationOrderPO.setFreeArea(decorationOrderVO.getFreeArea());
			decorationOrderPO.setHouseClass(decorationOrderVO.getHouseClass());
		}else{
			if(DecorationOrderPO.STATUS_SIGNED_STR.equals(decorationOrderVO.getStatus())){
				decorationOrderPO.setHouseType(decorationOrderVO.getHouseType());
			}
		}
		
		if(decorationOrderVO.getNotSalesmanRate() != null){
			decorationOrderPO.setNotSalesmanRate(decorationOrderVO.getNotSalesmanRate());
		}
		
		if(decorationOrderVO.getNotSalesmanName() != null){
			decorationOrderPO.setNotSalesmanName(decorationOrderVO.getNotSalesmanName());
		}
		
		if(decorationOrderVO.getNotSalesmanPhone() != null){
			decorationOrderPO.setNotSalesmanPhone(decorationOrderVO.getNotSalesmanPhone());
		}
		
		if(decorationOrderVO.getNotSalesmanContent() != null){
			decorationOrderPO.setNotSalesmanContent(decorationOrderVO.getNotSalesmanContent());
		}
		
		decorationOrderDao.saveOrUpdate(decorationOrderPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void changeDecorationOrderForVersionId(DecorationOrderVO decorationOrderVO, String userId){
		
		String orderId = decorationOrderVO.getOrderId();
		String versionId = decorationOrderVO.getVersionId();
		
		List<String> status = Arrays.asList(new String[]{DecorationOrderPO.STATUS_SIGNED_STR, DecorationOrderPO.STATUS_COMPLETED_STR, DecorationOrderPO.STATUS_WASTE_STR, DecorationOrderPO.STATUS_WASTE_STR}); // 已签约, 已完工, 废单, 合同终止
		
		String oldVersionId = "";
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(orderId);
		
		if(decorationOrderPO != null && !status.contains(decorationOrderPO.getStatus())){
			
			oldVersionId = decorationOrderPO.getVersionPO().getVersionId();
			
			decorationOrderPO.setVersionPO(new QuotationVersionPO(versionId));
			
			List<QuotationPO> quotationPOs = quotationDao.queryQuotationByOrderId(orderId);
			for(QuotationPO quotationPO: quotationPOs){
				List<QuotationFunctionAreaPO> quotationFunctionAreaPOs = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationPO.getQid());
				
				for(QuotationFunctionAreaPO quotationFunctionAreaPO: quotationFunctionAreaPOs){
					quotationFunctionAreaItemDao.deleteQuotationFunctionAreaItemByFunctionAreaId(quotationFunctionAreaPO.getQfaId());
					
					quotationFunctionAreaDao.delete(quotationFunctionAreaPO);
				}
				
				quotationDao.delete(quotationPO);
			}
			
			decorationOrderDao.update(decorationOrderPO);
			
			StringBuffer serviceRecoraInfo = new StringBuffer();
			serviceRecoraInfo.append("订单编号:");
			serviceRecoraInfo.append(orderId);
			serviceRecoraInfo.append("报价版本修改,原报价版本:");
			serviceRecoraInfo.append(oldVersionId);
			serviceRecoraInfo.append(",修改报价版本为:");
			serviceRecoraInfo.append(versionId);
			serviceRecoraInfo.append(".");
			
			ServiceRecordPO serviceRecordPO = new ServiceRecordPO();
			serviceRecordPO.setType(ServiceRecordPO.TYPE_TYPE_CHANGE_DECORATIONORDER_VERSIONID_INT);
			serviceRecordPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
			serviceRecordPO.setOperateUserId(userId);
			serviceRecordPO.setInfo(serviceRecoraInfo.toString());
			
			serviceRecordDao.saveOrUpdate(serviceRecordPO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int changeDecorationOrderForOrderId(String oldOrderId, String newOrderId, String userId) throws FLException{
		
		DecorationOrderPO decorationOrderPO;
		
		decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(newOrderId);
		
		if(decorationOrderPO != null){
			throw new FLException(140010, "订单编号已经存在");
		}
		
		decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(oldOrderId);
		
		if(decorationOrderPO != null){
			decorationOrderPO.setOrderId(newOrderId);
			
			decorationOrderDao.update(decorationOrderPO);
			
			DecorationOrderPO newDecorationOrderPO = new DecorationOrderPO();
			newDecorationOrderPO.setAutoId(decorationOrderPO.getAutoId());
			newDecorationOrderPO.setOrderId(newOrderId);
			
			List<DecorationBelongInfoPO> orderBelongInfoPOs = orderBelongInfoDao.queryOrderBelongInfoByOrderId(oldOrderId);
			
			for(DecorationBelongInfoPO orderBelongInfoPO: orderBelongInfoPOs){
				orderBelongInfoPO.setDecorationOrderPO(newDecorationOrderPO);
				
				orderBelongInfoDao.update(orderBelongInfoPO);
			}
			
			List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryDecorationPaymentByOrderId(oldOrderId);
			
			for(DecorationPaymentPO decorationPaymentPO: decorationPaymentPOs){
				decorationPaymentPO.setDecorationOrderPO(newDecorationOrderPO);
				
				decorationPaymentDao.update(decorationPaymentPO);
			}
		}
		
		StringBuffer serviceRecoraInfo = new StringBuffer();
		serviceRecoraInfo.append("订单编号修改,原订单编号:");
		serviceRecoraInfo.append(oldOrderId);
		serviceRecoraInfo.append(",修改编号为:");
		serviceRecoraInfo.append(newOrderId);
		serviceRecoraInfo.append(".");
		
		ServiceRecordPO serviceRecordPO = new ServiceRecordPO();
		serviceRecordPO.setType(ServiceRecordPO.TYPE_TYPE_CHANGE_DECORATIONORDER_ORDERID_INT);
		serviceRecordPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		serviceRecordPO.setOperateUserId(userId);
		serviceRecordPO.setInfo(serviceRecoraInfo.toString());
		
		serviceRecordDao.saveOrUpdate(serviceRecordPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void changeDecorationOrderForTime(DecorationOrderVO decorationOrderVO, int timeType, Timestamp dateTime, String userId){
		
		String orderId = decorationOrderVO.getOrderId();

		Timestamp oldCreateTime = null;
		
		Map<Integer, String> types = new HashMap<Integer, String>();
		types.put(1, "录入时间");
		types.put(2, "签单时间");
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(orderId);
		
		if(decorationOrderPO != null){
			
			if(timeType == 1){
				oldCreateTime = decorationOrderPO.getCreateTime();
				
				decorationOrderPO.setCreateTime(dateTime);
			}else if(timeType == 2){
				oldCreateTime = decorationOrderPO.getContractTime();
				
				decorationOrderPO.setContractTime(dateTime);
			}
			
			decorationOrderDao.update(decorationOrderPO);
			
			ServiceRecordPO serviceRecordPO = new ServiceRecordPO();
			serviceRecordPO.setType(ServiceRecordPO.TYPE_TYPE_CHANGE_DECORATIONORDER_DATETIME_INT);
			serviceRecordPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
			serviceRecordPO.setOperateUserId(userId);
			serviceRecordPO.setInfo(String.format("订单编号:%s,类型为:%s,录入时间修改,原录入时间:%s,修改录入时间为:%s.", orderId, types.get(timeType), oldCreateTime != null ? oldCreateTime.toString() : "空", dateTime.toString()));
			
			serviceRecordDao.saveOrUpdate(serviceRecordPO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void changeDecorationOrderForStatus(DecorationOrderVO decorationOrderVO, String userId){
		
		String orderId = decorationOrderVO.getOrderId();
		String status = decorationOrderVO.getStatus();
		
		String oldStatus = "";
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(orderId);
		
		if(decorationOrderPO != null){
			oldStatus = decorationOrderPO.getStatus();
			
			decorationOrderPO.setStatus(status);
			
			decorationOrderDao.update(decorationOrderPO);
			
			ServiceRecordPO serviceRecordPO = new ServiceRecordPO();
			serviceRecordPO.setType(ServiceRecordPO.TYPE_TYPE_CHANGE_DECORATIONORDER_DATETIME_INT);
			serviceRecordPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
			serviceRecordPO.setOperateUserId(userId);
			serviceRecordPO.setInfo(String.format("订单编号:%s状态修改,原状态:%s,修改状态为:%s.", orderId, oldStatus, status));
			
			serviceRecordDao.saveOrUpdate(serviceRecordPO);
		}
	}
	
	@Override
	public void changeDecorationOrderForType(DecorationOrderVO decorationOrderVO, String userId) {
		String orderId = decorationOrderVO.getOrderId();
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(orderId);
		
		if(decorationOrderPO != null){
			short oldType = decorationOrderPO.getType();
			
			decorationOrderPO.setType(decorationOrderVO.getType());
			
			decorationOrderDao.update(decorationOrderPO);
			
			ServiceRecordPO serviceRecordPO = new ServiceRecordPO();
			serviceRecordPO.setType(ServiceRecordPO.TYPE_TYPE_CHANGE_DECORATIONORDER_DATETIME_INT);
			serviceRecordPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
			serviceRecordPO.setOperateUserId(userId);
			serviceRecordPO.setInfo(String.format("订单编号:%s状态修改,原类型:%s,修改类型为:%s.", orderId, String.valueOf(oldType), String.valueOf(decorationOrderVO.getType())));
			
			serviceRecordDao.saveOrUpdate(serviceRecordPO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void createDecorationOrder(DecorationOrderVO decorationOrderVO) throws FLException{
		DecorationOrderPO decorationOrderPO = new DecorationOrderPO();
		
		if(queryDecorationOrderByVillageIdAHouseNumber(decorationOrderVO) != null){
			throw new FLException(140034, "订单楼盘,楼号已存在");
		}
		
		QuotationVersionPO quotationVersionPO = quotationVersionDao.queryQuotationVersionByDefaultFlag(1).get(0);
		decorationOrderPO.setVersionPO(quotationVersionPO);
		
		String currentDate = DateUtil.current("yyyyMMdd").toString().substring(2);
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_DECORATION_ORDER_INT, currentDate);
		
		String orderId = currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");
		
		decorationOrderPO.setOrderId(orderId);
		decorationOrderPO.setBackOrderContent(decorationOrderVO.getBackOrderContent());
		decorationOrderPO.setBackOrderName(decorationOrderVO.getBackOrderName());
		decorationOrderPO.setBackOrderPhone(decorationOrderVO.getBackOrderPhone());
		decorationOrderPO.setNotSalesmanContent(decorationOrderVO.getNotSalesmanContent());
		decorationOrderPO.setNotSalesmanName(decorationOrderVO.getNotSalesmanName());
		
		if(decorationOrderVO.getNotSalesmanRate() == null || decorationOrderVO.getNotSalesmanRate() > 1 || decorationOrderVO.getNotSalesmanRate() < 0){
			decorationOrderPO.setNotSalesmanRate((float) 0);
		}else{
			decorationOrderPO.setNotSalesmanRate(decorationOrderVO.getNotSalesmanRate());
		}
		
		decorationOrderPO.setNotSalesmanPhone(decorationOrderVO.getNotSalesmanPhone());
		decorationOrderPO.setHouseArea(decorationOrderVO.getHouseArea());
		decorationOrderPO.setFreeArea((float) 0);
		decorationOrderPO.setHouseClass(decorationOrderVO.getHouseClass());
		decorationOrderPO.setHouseNumber(decorationOrderVO.getHouseNumber());
		decorationOrderPO.setHouseType(decorationOrderVO.getHouseType());
		decorationOrderPO.setStatus(decorationOrderVO.getStatus());
		decorationOrderPO.setOrderTotalPrice((float) 0);
		decorationOrderPO.setSalesmanType(decorationOrderVO.getSalesmanType());
		decorationOrderPO.setCompany(SystemConfig.getInt("company"));
		
		decorationOrderPO.setCustomerPO(new CustomerPO(decorationOrderVO.getCustomer().getId()));
		decorationOrderPO.setVillagePO(new VillagePO(decorationOrderVO.getVillage().getVillageId()));
		
		UserPO designer = userDao.get(decorationOrderVO.getDesignerId());
		UserPO salesman = userDao.get(decorationOrderVO.getSalesmanId());
		
		decorationOrderPO.setDesignerPO(designer);
		decorationOrderPO.setSalesmanPO(salesman);
		
		decorationOrderPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		
		UserPO operater = new UserPO(decorationOrderVO.getCreateUserId());
		decorationOrderPO.setCreateUserPO(operater);
		
		decorationOrderPO.setProjectStatus(DecorationOrderPO.PROJECTSTATUS_WAITING_STR);
		
		decorationOrderPO.setOtherStatus(0);
		
		decorationOrderDao.save(decorationOrderPO);
		
		//创建订单归属信息
		DecorationBelongInfoPO belongDesignerInfo = new DecorationBelongInfoPO();
		belongDesignerInfo.setBelongDeptPO(decorationOrderPO.getDesignerPO().getDept());
		belongDesignerInfo.setBelongRate((float) 1);
		belongDesignerInfo.setBelongRegionPO(decorationOrderPO.getDesignerPO().getDept().getFatherDept());
		belongDesignerInfo.setBelongUserPO(decorationOrderPO.getDesignerPO());
		belongDesignerInfo.setBelongType(DecorationBelongInfoPO.BELONGTYPE_DESIGN_STR);
		belongDesignerInfo.setDefaultFlag(DecorationBelongInfoPO.DEFAULTFLAG_TRUE_STR);
		belongDesignerInfo.setOperateUserPO(operater);
		belongDesignerInfo.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		belongDesignerInfo.setStatus(DecorationBelongInfoPO.STATUS_PASS_STR);
		belongDesignerInfo.setDecorationOrderPO(decorationOrderPO);
		orderBelongInfoDao.saveOrUpdate(belongDesignerInfo);
		
		DecorationBelongInfoPO belongsalesmanInfo = new DecorationBelongInfoPO();
		belongsalesmanInfo.setBelongDeptPO(decorationOrderPO.getSalesmanPO().getDept());
		belongsalesmanInfo.setBelongRate((float) 1);
		
		if(decorationOrderPO.getSalesmanPO().getDept().getFatherDept() == null){
			belongsalesmanInfo.setBelongRegionPO(null);
		}else{
			belongsalesmanInfo.setBelongRegionPO(decorationOrderPO.getSalesmanPO().getDept().getFatherDept());
		}
		
		belongsalesmanInfo.setBelongUserPO(decorationOrderPO.getSalesmanPO());
		belongsalesmanInfo.setBelongType(DecorationBelongInfoPO.BELONGTYPE_SALESMAN_STR);
		belongsalesmanInfo.setDefaultFlag(DecorationBelongInfoPO.DEFAULTFLAG_TRUE_STR);
		belongsalesmanInfo.setOperateUserPO(operater);
		belongsalesmanInfo.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		belongsalesmanInfo.setStatus(DecorationBelongInfoPO.STATUS_PASS_STR);
		belongsalesmanInfo.setDecorationOrderPO(decorationOrderPO);
		
		orderBelongInfoDao.saveOrUpdate(belongsalesmanInfo);
		
		//通知业务员及设计师
		
		StringBuffer contents = new StringBuffer();
		contents.append("您有新的订单,订单号:");
		contents.append(decorationOrderPO.getOrderId());
		
		MessageVO message = new MessageVO();
		message.setContents(contents.toString());
		message.setReceiver(new UserVO(decorationOrderPO.getDesignerPO().getUserId()));
		message.setSender(new UserVO(decorationOrderVO.getCreateUserId()));
		message.setType(MessagePO.MESSAGE_TYPE_BELONG_STR);
		
		messageService.sendMessage(message);
		
		message.setReceiver(new UserVO(decorationOrderPO.getSalesmanPO().getUserId()));
		messageService.sendMessage(message);
		
		DecorationPaymentPO designFee = new DecorationPaymentPO();
		
		designFee.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		designFee.setPaymentType(DecorationPaymentPO.PAYMENTTYPE_DESIGN_STR);
		designFee.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNSUBMIT_STR);
		designFee.setDecorationOrderPO(decorationOrderPO);
		
		decorationPaymentDao.save(designFee);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void createDecorationOrderForMaterial(DecorationOrderVO decorationOrderVO) throws FLException{
		DecorationOrderPO decorationOrderPO = new DecorationOrderPO();
		
		if(queryDecorationOrderByVillageIdAHouseNumber(decorationOrderVO) != null){
			throw new FLException(140034, "订单楼盘,楼号已存在");
		}
		
		QuotationVersionPO versionPO = quotationVersionDao.queryQuotationVersionByDefaultFlag(1).get(0);
		decorationOrderPO.setVersionPO(versionPO);
		
		String currentDate = DateUtil.current("yyyyMMdd").toString().substring(2);
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_DECORATION_ORDER_INT, currentDate);
		
		String orderId = currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");
		
		decorationOrderPO.setOrderId(orderId);
		decorationOrderPO.setBackOrderContent(decorationOrderVO.getBackOrderContent());
		decorationOrderPO.setBackOrderName(decorationOrderVO.getBackOrderName());
		decorationOrderPO.setBackOrderPhone(decorationOrderVO.getBackOrderPhone());
		decorationOrderPO.setNotSalesmanContent(decorationOrderVO.getNotSalesmanContent());
		decorationOrderPO.setNotSalesmanName(decorationOrderVO.getNotSalesmanName());
		decorationOrderPO.setNotSalesmanRate(decorationOrderVO.getNotSalesmanRate());
		decorationOrderPO.setNotSalesmanPhone(decorationOrderVO.getNotSalesmanPhone());
		decorationOrderPO.setHouseArea(decorationOrderVO.getHouseArea());
		decorationOrderPO.setFreeArea((float) 0);
		decorationOrderPO.setHouseClass(decorationOrderVO.getHouseClass());
		decorationOrderPO.setHouseNumber(decorationOrderVO.getHouseNumber());
		decorationOrderPO.setHouseType(decorationOrderVO.getHouseType());
		decorationOrderPO.setStatus(decorationOrderVO.getStatus());
		decorationOrderPO.setOrderTotalPrice((float) 0);
		decorationOrderPO.setSalesmanType(decorationOrderVO.getSalesmanType());
		decorationOrderPO.setCompany(decorationOrderVO.getCompany());
		
		decorationOrderPO.setCustomerPO(new CustomerPO(decorationOrderVO.getCustomer().getId()));
		decorationOrderPO.setVillagePO(new VillagePO(decorationOrderVO.getVillage().getVillageId()));
		
		decorationOrderPO.setDesignerPO(new UserPO(decorationOrderVO.getDesignerId()));
		decorationOrderPO.setSalesmanPO(new UserPO(decorationOrderVO.getSalesmanId()));
		
		decorationOrderPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		
		UserPO operater = new UserPO(decorationOrderVO.getCreateUserId());
		decorationOrderPO.setCreateUserPO(operater);
			
		decorationOrderPO.setProjectStatus(DecorationOrderPO.PROJECTSTATUS_WAITING_STR);
		
		decorationOrderDao.save(decorationOrderPO);
		decorationOrderDao.refresh(decorationOrderPO);
		
		//通知业务员及设计师
		
		MessageVO message = new MessageVO();
		message.setContents("您有新的主材订单,订单号:" + decorationOrderPO.getOrderId());
		message.setSender(new UserVO(decorationOrderVO.getCreateUserId()));
		message.setType(MessagePO.MESSAGE_TYPE_BELONG_STR);
		
		if(decorationOrderPO.getDesignerPO() != null){
			message.setReceiver(new UserVO(decorationOrderPO.getDesignerPO().getUserId()));
			messageService.sendMessage(message);
		}
		
		if(decorationOrderPO.getSalesmanPO()!=null){
			message.setReceiver(new UserVO(decorationOrderPO.getSalesmanPO().getUserId()));
			messageService.sendMessage(message);
		}
		
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int obsoleteDecorationOrder(DecorationOrderVO decorationOrderVO, String userName) throws FLException{
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(decorationOrderVO.getOrderId());
		
		if(decorationOrderPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		String status = decorationOrderPO.getStatus();
		
		if(DecorationOrderPO.STATUS_WASTE_STR.equals(status)){ // 废单
			throw new FLException(140021, "订单已处于废单状态");
		}
		
		if(DecorationOrderPO.STATUS_SIGNED_STR.equals(status)){ // 签约
			throw new FLException(140022, "订单已签约,不可废单");
		}
		
		if(DecorationOrderPO.STATUS_COMPLETED_STR.equals(status)){ // 完工
			throw new FLException(140023, "订单已完工,不可废单");
		}
		
		if(DecorationOrderPO.STATUS_TERMINATION_STR.equals(status)){ // 终止
			throw new FLException(140024, "订单合同终止,不可废单");
		}
		
		if(DecorationOrderPO.STATUS_RESIGNED_STR.equals(status)){
			throw new FLException(140026, "订单重新签约,不能终止合同"); // 重新签约
		}
		
		decorationOrderPO.setStatus(DecorationOrderPO.STATUS_WASTE_STR);
		
		decorationOrderDao.saveOrUpdate(decorationOrderPO);
		
		DecorationOrderOperateHistoryPO decorationOrderOperateHistoryPO = new DecorationOrderOperateHistoryPO();
		
		decorationOrderOperateHistoryPO.setOrderId(decorationOrderPO.getOrderId());
		decorationOrderOperateHistoryPO.setDes(String.format("订单废单,操作人:%s", userName));
		decorationOrderOperateHistoryPO.setOperateTime(DateUtil.current("yyyy-MM-dd HH:mm:ss"));
		
		decorationOrderOperateHistoryDao.save(decorationOrderOperateHistoryPO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int terminalDecorationOrder(DecorationOrderVO decorationOrderVO, float refundValue, float paymentValue, String userId) throws FLException{
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(decorationOrderVO.getOrderId());
		
		if(DecorationOrderPO.STATUS_SIGNED_STR.equals(decorationOrderPO.getStatus())){ // 签约

			decorationOrderPO.setStatus(DecorationOrderPO.STATUS_TERMINATION_STR);
			decorationOrderDao.update(decorationOrderPO);
			
			DecorationPaymentPO decorationPaymentPO = new DecorationPaymentPO();
			decorationPaymentPO.setCreateUserPO(new UserPO(userId));
			decorationPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			decorationPaymentPO.setPaymentType(DecorationPaymentPO.PAYMENTTYPE_CONTRACT_REFUND_STR);
			decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_STR);
			decorationPaymentPO.setReferMoney(refundValue);
			decorationPaymentPO.setDecorationOrderPO(decorationOrderPO);
			
			decorationPaymentDao.save(decorationPaymentPO);
			
			if(refundValue < paymentValue){
				DecorationPaymentPO penalty = new DecorationPaymentPO();
				
				penalty.setCreateUserPO(new UserPO(userId));
				penalty.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
				penalty.setPaymentType(DecorationPaymentPO.PAYMENTTYPE_PENALTY_STR);
				penalty.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_PAY_STR);
				penalty.setReferMoney(Arith.sub(paymentValue, refundValue));
				penalty.setDecorationOrderPO(decorationOrderPO);
				
				decorationPaymentDao.save(penalty);
			}
			
			float orderTotalPrice = Arith.sub(0, decorationOrderPO.getOrderTotalPrice());
			
			UserPO userPO = decorationOrderPO.getDesignerPO();
			DepartmentPO departmentPO = userPO.getDept();
			DepartmentPO regionPO = userPO.getDept().getFatherDept();
			
			String designerId = userPO.getUserId();
			String designerName = userPO.getUserName();
			
			String departmentId = departmentPO.getDeptId();
			String departmentName = departmentPO.getDeptName();
			
			String regionId = regionPO.getDeptId();
			String regionName = regionPO.getDeptName();
			
			String currentTimeStr = DateUtil.current("yyyy-MM-dd");
			
			String notCountDesignDepartmentId = SystemConfig.getString("notCountDesignDepartmentId", "");
			
			if(notCountDesignDepartmentId.indexOf(designerId) == -1){ // 部分部门不参与业绩统计
				decorationRankService.updateDecorationDesignerRank(designerId, designerName, orderTotalPrice, currentTimeStr);
				decorationRankService.updateDecorationDesignerDepartmentRank(departmentId, departmentName, orderTotalPrice, currentTimeStr);
				decorationRankService.updateDecorationDesignerRegionRank(regionId, regionName, orderTotalPrice, currentTimeStr);
			}
			
			return 0;
		}

		throw new FLException(140025, "订单非签约,不能终止合同");
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int subDecorationOrderForQuotationTime(DecorationOrderVO decorationOrderVO, String userName) throws FLException {
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(decorationOrderVO.getOrderId());
		
		if(decorationOrderPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		if(decorationOrderPO.getQuotationTimeLimit() > 0){
			decorationOrderPO.setQuotationTimeLimit(decorationOrderPO.getQuotationTimeLimit() - 1);
			
			decorationOrderDao.update(decorationOrderPO);
		}
		
		DecorationOrderOperateHistoryPO decorationOrderOperateHistoryPO = new DecorationOrderOperateHistoryPO();
		
		decorationOrderOperateHistoryPO.setOrderId(decorationOrderPO.getOrderId());
		decorationOrderOperateHistoryPO.setDes(String.format("订单增加复制次数,操作人:%s", userName));
		decorationOrderOperateHistoryPO.setOperateTime(DateUtil.current("yyyy-MM-dd HH:mm:ss"));
		
		decorationOrderOperateHistoryDao.save(decorationOrderOperateHistoryPO);
		
		return 0;
	}
	
}
