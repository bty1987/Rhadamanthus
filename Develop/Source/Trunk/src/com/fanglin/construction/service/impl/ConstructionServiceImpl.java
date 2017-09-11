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
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.po.AcceptancePO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.construction.service.ConstructionService;
import com.fanglin.construction.vo.ConstructionVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.CustomerVO;
import com.fanglin.data.common.vo.VillageVO;
import com.fanglin.quotation.dao.AddReduceDao;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.quotation.po.AddReducePO;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.decoration.vo.DecorationOrderVO;
import com.fanglin.information.dao.MessageDao;
import com.fanglin.information.po.MessagePO;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("constructionService")
@Transactional(readOnly=true)
public class ConstructionServiceImpl implements ConstructionService {
	
	@Autowired
	private ConstructionDao constructionDao;
	
	@Autowired
	private AddReduceDao addReduceDao;
	
	@Autowired
	private DecorationOrderDao decorationOrderDao;
	
	@Autowired
	private DecorationPaymentDao decorationPaymentDao;
	
	@Autowired
	private QuotationDao quotationDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private MessageDao messageDao;
	
	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;
	
	@Override
	public void pageDecorationOrderForConstruction(Paging paging, List<Filter> filters, Integer company){
		
		List<ConstructionPO> constructionSchedulePOs = constructionDao.pageConstruction(paging, filters, company);
		List<DecorationOrderVO> decorationOrderVOs = new ArrayList<DecorationOrderVO>();
		
		for(ConstructionPO constructionSchedulePO: constructionSchedulePOs){
			decorationOrderVOs.add(decorationOrderPOToVO(constructionSchedulePO.getDecorationOrderPO()));
		}
		
		paging.setData(decorationOrderVOs);
	}
	
	@Override
	public void pageDecorationOrderForSupervisionByUserId(Paging paging, List<Filter> filters, String userId, UserPO userPO, Integer company){
		
		if(userPO == null){
			userPO = userDao.queryUserByUserId(userId);
		}else{
			userId = userPO.getUserId();
		}
		
		if(userPO != null){
			String duty = userPO.getDuty();
			
			if(duty.contains("监理")){
				filters.add(new Filter(ConstructionPO.COLUMN_SUPERVISORQUALITYID_STR, userId, "eq"));
			}
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
		
		List<ConstructionPO> constructionSchedulePOs = constructionDao.pageConstructionForAcceptance(paging, filters, company);
		List<DecorationOrderVO> decorationOrderVOs = new ArrayList<DecorationOrderVO>();
		
		for(ConstructionPO constructionSchedulePO: constructionSchedulePOs){
			decorationOrderVOs.add(decorationOrderPOToVO(constructionSchedulePO.getDecorationOrderPO()));
		}
		
		paging.setData(decorationOrderVOs);
	}
	
	@Override
	public ConstructionVO queryConstructionById(int cid){
		
		ConstructionPO constructionSchedulePO = constructionDao.get(cid);
		ConstructionVO constructionScheduleVO = new ConstructionVO();
		
		BeanUtil.copyProperties(constructionSchedulePO, constructionScheduleVO);
		
		return constructionScheduleVO;
	}
	
	@Override
	public ConstructionVO queryConstructionByOrderId(ConstructionVO constructionVO, String userId){
		
		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(constructionVO.getOrderId());
		
		BeanUtil.copyProperties(constructionPO, constructionVO);
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		if(userPO != null && constructionPO != null){
			
			int schedule = constructionPO.getSchedule();
			
			if(userPO.getDuty().contains("质检") && (userPO.getDuty().contains("水暖工") || userPO.getDuty().contains("电工") || userPO.getDuty().contains("力工"))){
				
				if(schedule >= ConstructionPO.SCHEDULE_TYPE_WATERWAYCIRCUIT_INT && schedule < ConstructionPO.SCHEDULE_TYPE_WATERWAYCIRCUITCHECK_INT){
					constructionVO.setSchedule(ConstructionPO.SCHEDULE_TYPE_WATERWAYCIRCUIT_INT);
				}else if(schedule >= ConstructionPO.SCHEDULE_TYPE_WATERWAYCIRCUITCHECK_INT){
					constructionVO.setSchedule(ConstructionPO.SCHEDULE_TYPE_WATERWAYCIRCUITCHECK_INT);
				}
			}else if(userPO.getDuty().contains("质检") && (userPO.getDuty().contains("铲大白"))){
				
				if(schedule >= ConstructionPO.SCHEDULE_TYPE_CHAN_INT && schedule < ConstructionPO.SCHEDULE_TYPE_GROUNDLEVELING_INT){
					constructionVO.setSchedule(ConstructionPO.SCHEDULE_TYPE_CHAN_INT);
				}else if(schedule >= ConstructionPO.SCHEDULE_TYPE_GROUNDLEVELING_INT){
					constructionVO.setSchedule(ConstructionPO.SCHEDULE_TYPE_GROUNDLEVELING_INT);
				}
			}
		}
		
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
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int checkConstructionForChanStatus(ConstructionVO constructionVO) throws FLException{
		
		long cid = constructionVO.getCid();
		short schedule = constructionVO.getSchedule().shortValue();
		
		List<ConstructionSchedulePO> constructionSchedulePOs = constructionScheduleDao.queryConstructionScheduleByCid(cid, schedule);
		
		for (ConstructionSchedulePO constructionSchedulePO : constructionSchedulePOs) {
			if(constructionSchedulePO != null){
				if(constructionSchedulePO.getStatus() == ConstructionSchedulePO.STATUS_TYPE_DELAY_INT){
					ConstructionPO constructionPO = constructionDao.get(constructionVO.getCid());
					
					if(constructionSchedulePO != null){
						
						MessagePO messagePO = new MessagePO();
						UserPO senderU = userDao.queryUserByUserId(constructionPO.getSupervisorQualityId());
						UserPO senderR = userDao.queryUserByUserId(constructionPO.getSupervisorQualityId());
						messagePO.setSender(senderU);
						messagePO.setReceiver(senderR);
						messagePO.setType("施工进度消息");
						messagePO.setContents(String.format("装修订单编号%s施工进度中,铲大白状态需要标记为成功或者通过.", constructionPO.getDecorationOrderPO().getOrderId()));
						messagePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
						messagePO.setStatus("未读");
						messagePO.setArgs("");
						messageDao.saveOrUpdate(messagePO);
					}
					
					throw new FLException(120004, "铲大白状态需要标记为成功或者通过");
				}
			}
		}
		
		return 0;
	}

	@Override
	public int checkFirstPayment(ConstructionVO constructionVO) throws FLException{
		
		String orderId = constructionVO.getOrderId();
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(orderId);
		
		if(decorationOrderPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.queryDecorationPaymentByOrderIdAType(orderId, DecorationPaymentPO.PAYMENTTYPE_FIRST_STR);
		if(decorationPaymentPO == null || (decorationPaymentPO != null && (!DecorationPaymentPO.PAYMENTSTATUS_PAY_STR.equals(decorationPaymentPO.getPaymentStatus()) && !DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_STR.equals(decorationPaymentPO.getPaymentStatus())))){
			throw new FLException(120005, "当前订单首付款没有完成财务处理");
		}
		
		if(DecorationOrderPO.HOUSETYPE_OFFPLAN_STR.equals(decorationOrderPO.getHouseType())){
			decorationPaymentPO = decorationPaymentDao.queryDecorationPaymentByOrderIdAType(orderId, DecorationPaymentPO.PAYMENTTYPE_FIRST_SECOND_STR);
			
			if(decorationPaymentPO == null || (decorationPaymentPO != null && (!DecorationPaymentPO.PAYMENTSTATUS_PAY_STR.equals(decorationPaymentPO.getPaymentStatus()) && !DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_STR.equals(decorationPaymentPO.getPaymentStatus())))){
				throw new FLException(120018, "当前订单首付二期款没有完成财务处理");
			}
		}
		
		return 0;
	}

	@Override
	public int checkSecondPayment(ConstructionVO constructionScheduleVO) throws FLException{
		
		String orderId = constructionScheduleVO.getOrderId();
		
		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.queryDecorationPaymentByOrderIdAType(orderId, DecorationPaymentPO.PAYMENTTYPE_SECOND_STR);
		if(decorationPaymentPO == null || decorationPaymentPO != null && (!DecorationPaymentPO.PAYMENTSTATUS_PAY_STR.equals(decorationPaymentPO.getPaymentStatus()) && !DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_STR.equals(decorationPaymentPO.getPaymentStatus()))){
			throw new FLException(120006, "当前订单二期款没有完成财务处理");
		}
		
		List<AddReducePO> addReducePOs = addReduceDao.queryAddReduceByOrderId(orderId);
		for(AddReducePO addReducePO: addReducePOs){
			if(addReducePO.getStatus() != AddReducePO.STATUS_PAYED_INT){
				throw new FLException(120007, "当前订单相关的增项没有完成财务处理");
			}
		}
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int checkFinalyPayment(ConstructionVO constructionVO, String userId) throws FLException{
		
		String orderId = constructionVO.getOrderId();
		
		DecorationPaymentPO decorationPaymentPOFinal = decorationPaymentDao.queryDecorationPaymentByOrderIdAType(orderId, DecorationPaymentPO.PAYMENTTYPE_FINAL_STR);
		
		if(decorationPaymentPOFinal == null || decorationPaymentPOFinal != null && (!DecorationPaymentPO.PAYMENTSTATUS_PAY_STR.equals(decorationPaymentPOFinal.getPaymentStatus()) && !DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_STR.equals(decorationPaymentPOFinal.getPaymentStatus()))){
			throw new FLException(120008, "当前订单尾款没有完成财务处理");
		}
		
		DecorationPaymentPO decorationPaymentPOBreak = decorationPaymentDao.queryDecorationPaymentByOrderIdAType(orderId, DecorationPaymentPO.PAYMENTTYPE_PENALTY_STR);
		if(decorationPaymentPOBreak != null){
			if(!DecorationPaymentPO.PAYMENTSTATUS_PAY_STR.equals(decorationPaymentPOBreak.getPaymentStatus()) && !DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_STR.equals(decorationPaymentPOBreak.getPaymentStatus())){
				throw new FLException(120009, "当前订单违约金没有完成财务处理");
			}
		}else{
			float total = 0;
			float decorationOrderTotalPrice = 0;
			
			List<AddReducePO> addReducePOs = addReduceDao.queryAddReduceByOrderId(orderId);
			for(AddReducePO addReducePO: addReducePOs){
				if(addReducePO.getType() == AddReducePO.TYPE_LEAKAGE_INT){
					continue;
				}
				
				if(addReducePO.getStatus() != AddReducePO.STATUS_PAYED_INT){
					throw new FLException(120010, "当前订单存在增减项没有完成财务处理");
				}else{
					if(addReducePO.getType() == AddReducePO.TYPE_ADD_INT){
						total += addReducePO.getTotal();
					}else if(addReducePO.getType() == AddReducePO.TYPE_REDUCE_INT){
						total -= addReducePO.getTotal();
					}
				}
			}
			
			DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(orderId);
			if(decorationOrderPO != null){
				decorationOrderTotalPrice = decorationOrderPO.getOrderTotalPrice();
			}
			
			if(decorationOrderTotalPrice == 0f){
				throw new FLException(120011, "订单总价为零");
			}else if(decorationOrderTotalPrice > 0f){
				if(total < 0 && Math.abs(total) >= Arith.mul(decorationOrderTotalPrice, 0.05f)){
					DecorationPaymentPO _decorationPaymentPO = new DecorationPaymentPO();
					_decorationPaymentPO.setDecorationOrderPO(decorationOrderPO);
					_decorationPaymentPO.setPaymentType(DecorationPaymentPO.PAYMENTTYPE_PENALTY_STR);
					_decorationPaymentPO.setPaymentStatus(DecorationPaymentPO.PAYMENTSTATUS_UNSUBMIT_STR);
					_decorationPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
					
					_decorationPaymentPO.setReferMoney(Arith.mul(Math.abs(total), 0.3f));
					
					decorationPaymentDao.saveOrUpdate(_decorationPaymentPO);
					
					UserPO userS = userDao.queryUserByUserId(userId);
					MessagePO messagePO = new MessagePO();
					messagePO.setSender(userS);
					messagePO.setReceiver(decorationOrderPO.getDesignerPO());
					messagePO.setType("违约金消息");
					messagePO.setContents(String.format("装修订单编号:%s生成一条违约金记录信息", decorationOrderPO.getOrderId()));
					messagePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
					messagePO.setStatus(MessagePO.MESSAGE_STATUS_UNREAD_STR);
					messagePO.setArgs("");
					
					messageDao.saveOrUpdate(messagePO);
					
					throw new FLException(120012, "当前订单存在违约金需要完成财务处理");
				}
			}
		}
		
		return 0;
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
	
	public void sendCustomerServiceMessage(String qualityId, String orderId, String scheduleInfo){
		
		List<String> dutys = Arrays.asList(new String[]{"前台咨询师"});
		List<UserPO> userPOs = userDao.queryUserByDutys(dutys);
		
		for(UserPO userPO: userPOs){
			
			MessagePO messagePO = new MessagePO();
			UserPO userSender = userDao.queryUserByUserId(qualityId);
			messagePO.setSender(userSender);
			messagePO.setReceiver(userPO);
			messagePO.setType("施工消息");
			messagePO.setContents(String.format("装修订单编号:%s%s进度已经结束,请尽快回访客户", orderId, scheduleInfo));
			messagePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			messagePO.setStatus(MessagePO.MESSAGE_STATUS_UNREAD_STR);
			messagePO.setArgs("");
			messageDao.saveOrUpdate(messagePO);
		}
	}
}
