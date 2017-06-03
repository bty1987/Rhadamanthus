/**
 * @File Name		: ConstructionScheduleServiceImpl.java
 * @Package   	: com.fanglin.service.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
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

import com.fanglin.construction.dao.BricklayConstructionScheduleDao;
import com.fanglin.construction.dao.CarpentConstructionScheduleDao;
import com.fanglin.construction.dao.ChanConstructionScheduleDao;
import com.fanglin.construction.dao.CleaningConstructionScheduleDao;
import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.dao.GroundLevelingConstructionScheduleDao;
import com.fanglin.construction.dao.OilConstructionScheduleDao;
import com.fanglin.construction.dao.PutlineConstructionScheduleDao;
import com.fanglin.construction.dao.WaterwayCircuitCheckConstructionScheduleDao;
import com.fanglin.construction.dao.WaterwayCircuitPowerConstructionScheduleDao;
import com.fanglin.construction.po.AcceptancePO;
import com.fanglin.construction.po.BricklayConstructionSchedulePO;
import com.fanglin.construction.po.CarpentConstructionSchedulePO;
import com.fanglin.construction.po.ChanConstructionSchedulePO;
import com.fanglin.construction.po.CleaningConstructionSchedulePO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.construction.po.GroundLevelingConstructionSchedulePO;
import com.fanglin.construction.po.OilConstructionSchedulePO;
import com.fanglin.construction.po.PutlineConstructionSchedulePO;
import com.fanglin.construction.po.WaterwayCircuitCheckConstructionSchedulePO;
import com.fanglin.construction.po.WaterwayCircuitPowerConstructionSchedulePO;
import com.fanglin.construction.service.ConstructionScheduleService;
import com.fanglin.construction.vo.ConstructionScheduleVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.CustomerVO;
import com.fanglin.data.common.vo.VillageVO;
import com.fanglin.decoration.dao.AddReduceDao;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.AddReducePO;
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

@Service("constructionScheduleService")
@Transactional(readOnly=true)
public class ConstructionScheduleServiceImpl implements ConstructionScheduleService {
	
	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;
	
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
	private ChanConstructionScheduleDao chanConstructionScheduleDao;
	
	@Autowired
	private PutlineConstructionScheduleDao putlineConstructionScheduleDao;
	
	@Autowired
	private WaterwayCircuitPowerConstructionScheduleDao waterwayCircuitPowerConstructionScheduleDao;
	
	@Autowired
	private BricklayConstructionScheduleDao bricklayConstructionScheduleDao;
	
	@Autowired
	private GroundLevelingConstructionScheduleDao groundLevelingConstructionScheduleDao;
	
	@Autowired
	private CarpentConstructionScheduleDao carpentConstructionScheduleDao;
	
	@Autowired
	private OilConstructionScheduleDao oilConstructionScheduleDao;
	
	@Autowired
	private WaterwayCircuitCheckConstructionScheduleDao waterwayCircuitCheckConstructionScheduleDao;
	
	@Autowired
	private CleaningConstructionScheduleDao cleaningConstructionScheduleDao;
	
	@Override
	public void pageDecorationOrderForConstructionSchedule(Paging paging, List<Filter> filters){
		
		List<ConstructionSchedulePO> constructionSchedulePOs = constructionScheduleDao.pageConstructionSchedule(paging, filters);
		List<DecorationOrderVO> decorationOrderVOs = new ArrayList<DecorationOrderVO>();
		
		for(ConstructionSchedulePO constructionSchedulePO: constructionSchedulePOs){
			decorationOrderVOs.add(decorationOrderPOToVO(constructionSchedulePO.getDecorationOrderPO()));
		}
		
		paging.setData(decorationOrderVOs);
	}
	
	@Override
	public void pageDecorationOrderForSupervisionByUserId(Paging paging, List<Filter> filters, String userId, UserPO userPO){
		
		if(userPO == null){
			userPO = userDao.get(userId);
		}else{
			userId = userPO.getUserId();
		}
		
		if(userPO != null){
			String duty = userPO.getDuty();
			
			if(duty.contains("监理")){
				filters.add(new Filter(ConstructionSchedulePO.COLUMN_SUPERVISORQUALITYID_STR, userId, "eq"));
			}
		}
		
		List<ConstructionSchedulePO> constructionSchedulePOs = constructionScheduleDao.pageConstructionScheduleForSupervision(paging, filters);
		List<DecorationOrderVO> decorationOrderVOs = new ArrayList<DecorationOrderVO>();
		
		for(ConstructionSchedulePO constructionSchedulePO: constructionSchedulePOs){
			
			decorationOrderVOs.add(decorationOrderPOToVO(constructionSchedulePO.getDecorationOrderPO()));
		}
		
		paging.setData(decorationOrderVOs);
	}
	
	@Override
	public void pageDecorationOrderForQualityByUserId(Paging paging, List<Filter> filters, String userId, UserPO userPO){
		
		int allocationWorkerFlag = 0;
		String allocationWokerOp = "and";
		Filter allocationWorkerFilter = null;
		
		
		for(Filter filter: filters){
			if(ConstructionSchedulePO.COLUMN_ALLOCATIONWORKERFLAG_STR.equals(filter.getField())){
				String _flag = filter.getData();
				
				if("notAllocationed".equals(_flag)){
					allocationWokerOp = "nand";
				}
				
				allocationWorkerFilter = filter;
			}
		}
		
		if(allocationWorkerFilter != null){
			filters.remove(allocationWorkerFilter);
		}
		
		List<Integer> schedules = new ArrayList<Integer>();
		
		if(userPO == null){
			userPO = userDao.get(userId);
		}else{
			userId = userPO.getUserId();
		}
		
		if(userPO.getDuty().contains("质检") && userPO.getDuty().contains("铲大白")){
			filters.add(new Filter(ConstructionSchedulePO.COLUMN_CHANQUALITYID_STR, userId, "eq", "or"));
			filters.add(new Filter(ConstructionSchedulePO.COLUMN_CHANSTATUS_STR, Integer.toString(ChanConstructionSchedulePO.STATUS_TYPE_DELAY_INT), "eq", "or"));
			
			allocationWorkerFlag += ChanConstructionSchedulePO.CHAN_ALLOCATION_WORKER_FLAG_INT;
			allocationWorkerFlag += GroundLevelingConstructionSchedulePO.GROUNDLEVELING_ALLOCATION_WORKER_FLAG_INT;
			
			schedules.add(ConstructionSchedulePO.SCHEDULE_TYPE_CHAN_INT);
			schedules.add(ConstructionSchedulePO.SCHEDULE_TYPE_GROUNDLEVELING_INT);
		}
		if(userPO.getDuty().contains("质检") && userPO.getDuty().contains("放线")){
			filters.add(new Filter(ConstructionSchedulePO.COLUMN_PUTLINEQUALITYID_STR, userId, "eq", "or"));
			
			allocationWorkerFlag += PutlineConstructionSchedulePO.PUBLINE_ALLOCATION_WORKER_FLAG_INT;
			
			schedules.add(ConstructionSchedulePO.SCHEDULE_TYPE_PUTLINE_INT);
		}
		if(userPO.getDuty().contains("质检") && (userPO.getDuty().contains("水暖工") || userPO.getDuty().contains("电工") || userPO.getDuty().contains("力工"))){
			filters.add(new Filter(ConstructionSchedulePO.COLUMN_WATERWAYCIRCUITQUALITYID_STR, userId, "eq", "or"));
			
			allocationWorkerFlag += WaterwayCircuitPowerConstructionSchedulePO.WATERWAYCIRCUITPOWER_ALLOCATION_WORKER_FLAG_INT;
			allocationWorkerFlag += WaterwayCircuitCheckConstructionSchedulePO.WATERWAYCIRCUITCHECK_ALLOCATION_WORKER_FLAG_INT;
			
			schedules.add(ConstructionSchedulePO.SCHEDULE_TYPE_WATERWAYCIRCUIT_INT);
			schedules.add(ConstructionSchedulePO.SCHEDULE_TYPE_WATERWAYCIRCUITCHECK_INT);
		}
		if(userPO.getDuty().contains("质检") && userPO.getDuty().contains("瓦工")){
			filters.add(new Filter(ConstructionSchedulePO.COLUMN_BRICKLAYQUALITYID_STR, userId, "eq", "or"));
			
			allocationWorkerFlag += BricklayConstructionSchedulePO.BRICKLAY_ALLOCATION_WORKER_FLAG_INT;
			
			schedules.add(ConstructionSchedulePO.SCHEDULE_TYPE_BRICKLAY_INT);
		}
		if(userPO.getDuty().contains("质检") && userPO.getDuty().contains("木工")){
			filters.add(new Filter(ConstructionSchedulePO.COLUMN_CARPENTQUALITYID_STR, userId, "eq", "or"));
			
			allocationWorkerFlag += CarpentConstructionSchedulePO.CARPENT_ALLOCATION_WORKER_FLAG_INT;
			
			schedules.add(ConstructionSchedulePO.SCHEDULE_TYPE_CARPENT_INT);
		}
		if(userPO.getDuty().contains("质检") && userPO.getDuty().contains("油工")){
			filters.add(new Filter(ConstructionSchedulePO.COLUMN_OILQUALITYID_STR, userId, "eq", "or"));
			
			allocationWorkerFlag += OilConstructionSchedulePO.OIL_ALLOCATION_WORKER_FLAG_INT;
			
			schedules.add(ConstructionSchedulePO.SCHEDULE_TYPE_OIL_INT);
		}
		if(userPO.getDuty().contains("质检") && userPO.getDuty().contains("保洁工")){
			filters.add(new Filter(ConstructionSchedulePO.COLUMN_CLEANINGQUALITYID_STR, userId, "eq", "or"));
			
			allocationWorkerFlag += CleaningConstructionSchedulePO.CLEANING_ALLOCATION_WORKER_FLAG_INT;
			
			schedules.add(ConstructionSchedulePO.SCHEDULE_TYPE_CLEANING_INT);
		}
		
		filters.add(new Filter(ConstructionSchedulePO.COLUMN_ALLOCATIONWORKERFLAG_STR, String.valueOf(allocationWorkerFlag), allocationWokerOp));
		
		List<ConstructionSchedulePO> constructionSchedulePOs = constructionScheduleDao.pageConstructionScheduleForQuality(paging, filters, schedules);
		List<DecorationOrderVO> decorationOrderVOs = new ArrayList<DecorationOrderVO>();
		
		for(ConstructionSchedulePO constructionSchedulePO: constructionSchedulePOs){
			decorationOrderVOs.add(decorationOrderPOToVO(constructionSchedulePO.getDecorationOrderPO()));
		}
		
		paging.setData(decorationOrderVOs);
	}
	
	@Override
	public void pageDecorationOrderForAcceptance(Paging paging, List<Filter> filters){
		
		String acceptanceFlagOp = "and";
		Filter acceptanceFilter = null;
	
		for(Filter filter: filters){
			if(ConstructionSchedulePO.COLUMN_ACCEPTANCEFLAG_STR.equals(filter.getField())){
				String _flag = filter.getData();
				
				if("notAcceptanced".equals(_flag)){
					acceptanceFlagOp = "nand";
				}
				
				acceptanceFilter = filter;
			}
		}
		
		if(acceptanceFilter != null){
			filters.remove(acceptanceFilter);
		}
		
		filters.add(new Filter(ConstructionSchedulePO.COLUMN_ALLOCATIONWORKERFLAG_STR, String.valueOf(AcceptancePO.ACCEPTANCE_ALLOCATION_WORKER_FLAG_INT), acceptanceFlagOp));
		filters.add(new Filter(ConstructionSchedulePO.COLUMN_SCHEDULE_STR, String.valueOf(ConstructionSchedulePO.SCHEDULE_TYPE_CLEANING_INT), "eq"));
		
		List<ConstructionSchedulePO> constructionSchedulePOs = constructionScheduleDao.pageConstructionScheduleForAcceptance(paging, filters);
		List<DecorationOrderVO> decorationOrderVOs = new ArrayList<DecorationOrderVO>();
		
		for(ConstructionSchedulePO constructionSchedulePO: constructionSchedulePOs){
			decorationOrderVOs.add(decorationOrderPOToVO(constructionSchedulePO.getDecorationOrderPO()));
		}
		
		paging.setData(decorationOrderVOs);
	}
	
	@Override
	public ConstructionScheduleVO queryConstructionScheduleById(int csId){
		
		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(csId);
		ConstructionScheduleVO constructionScheduleVO = new ConstructionScheduleVO();
		
		BeanUtil.copyProperties(constructionSchedulePO, constructionScheduleVO);
		
		return constructionScheduleVO;
	}
	
	@Override
	public ConstructionScheduleVO queryConstructionScheduleByOrderId(ConstructionScheduleVO constructionScheduleVO, String userId){
		
		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByOrderId(constructionScheduleVO.getOrderId());
		
		BeanUtil.copyProperties(constructionSchedulePO, constructionScheduleVO);
		
		UserPO userPO = userDao.get(userId);
		if(userPO != null && constructionSchedulePO != null){
			
			int schedule = constructionSchedulePO.getSchedule();
			
			if(userPO.getDuty().contains("质检") && (userPO.getDuty().contains("水暖工") || userPO.getDuty().contains("电工") || userPO.getDuty().contains("力工"))){
				
				if(schedule >= ConstructionSchedulePO.SCHEDULE_TYPE_WATERWAYCIRCUIT_INT && schedule < ConstructionSchedulePO.SCHEDULE_TYPE_WATERWAYCIRCUITCHECK_INT){
					constructionScheduleVO.setSchedule(ConstructionSchedulePO.SCHEDULE_TYPE_WATERWAYCIRCUIT_INT);
				}else if(schedule >= ConstructionSchedulePO.SCHEDULE_TYPE_WATERWAYCIRCUITCHECK_INT){
					constructionScheduleVO.setSchedule(ConstructionSchedulePO.SCHEDULE_TYPE_WATERWAYCIRCUITCHECK_INT);
				}
			}else if(userPO.getDuty().contains("质检") && (userPO.getDuty().contains("铲大白"))){
				
				if(schedule >= ConstructionSchedulePO.SCHEDULE_TYPE_CHAN_INT && schedule < ConstructionSchedulePO.SCHEDULE_TYPE_GROUNDLEVELING_INT){
					constructionScheduleVO.setSchedule(ConstructionSchedulePO.SCHEDULE_TYPE_CHAN_INT);
				}else if(schedule >= ConstructionSchedulePO.SCHEDULE_TYPE_GROUNDLEVELING_INT){
					constructionScheduleVO.setSchedule(ConstructionSchedulePO.SCHEDULE_TYPE_GROUNDLEVELING_INT);
				}
			}
		}
		
		return constructionScheduleVO;
	}
	
	@Override
	public ConstructionScheduleVO queryConstructionScheduleForWorkerNameByOrderId(	ConstructionScheduleVO constructionScheduleVO){
		
		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByOrderId(constructionScheduleVO.getOrderId());
		
		if(constructionSchedulePO != null){
		
			BeanUtil.copyProperties(constructionSchedulePO, constructionScheduleVO);
			
			if(constructionSchedulePO.getSupervisorQualityId() != null && !"".equals(constructionSchedulePO.getSupervisorQualityId())){
				UserPO supervisonQualityUser =  userDao.get(constructionSchedulePO.getSupervisorQualityId());
				if(supervisonQualityUser != null){
					constructionScheduleVO.setSupervisorQualityName(supervisonQualityUser.getCurrentName());
				}
			}
			
			if(constructionSchedulePO.getChanQualityId() != null && !"".equals(constructionSchedulePO.getChanQualityId())){
				UserPO chanQualityUser =  userDao.get(constructionSchedulePO.getChanQualityId());
				if(chanQualityUser != null){
					constructionScheduleVO.setChanQualityName(chanQualityUser.getCurrentName());
				}
			}
			
			if(constructionSchedulePO.getPutlineQualityId() != null && !"".equals(constructionSchedulePO.getPutlineQualityId())){
				UserPO putlineQualityUser =  userDao.get(constructionSchedulePO.getPutlineQualityId());
				if(putlineQualityUser != null){
					constructionScheduleVO.setPutlineQualityName(putlineQualityUser.getCurrentName());
				}
			}
			
			if(constructionSchedulePO.getWaterwayCircuitPowerQualityId() != null && !"".equals(constructionSchedulePO.getWaterwayCircuitPowerQualityId())){
				UserPO waterwayCircuitQualityUser =  userDao.get(constructionSchedulePO.getWaterwayCircuitPowerQualityId());
				if(waterwayCircuitQualityUser != null){
					constructionScheduleVO.setWaterwayCircuitPowerQualityName(waterwayCircuitQualityUser.getCurrentName());
				}
			}
			
			if(constructionSchedulePO.getPowerQualityId() != null && !"".equals(constructionSchedulePO.getPowerQualityId())){
				UserPO powerQualityUser =  userDao.get(constructionSchedulePO.getPowerQualityId());
				if(powerQualityUser != null){
					constructionScheduleVO.setPowerQualityName(powerQualityUser.getCurrentName());
				}
			}
			
			if(constructionSchedulePO.getBricklayQualityId() != null && !"".equals(constructionSchedulePO.getBricklayQualityId())){
				UserPO bricklayQualityUser =  userDao.get(constructionSchedulePO.getBricklayQualityId());
				if(bricklayQualityUser != null){
					constructionScheduleVO.setBricklayQualityName(bricklayQualityUser.getCurrentName());
				}
			}
			
			if(constructionSchedulePO.getCarpentQualityId() != null && !"".equals(constructionSchedulePO.getCarpentQualityId())){
				UserPO carpentQualityUser =  userDao.get(constructionSchedulePO.getCarpentQualityId());
				if(carpentQualityUser != null){
					constructionScheduleVO.setCarpentQualityName(carpentQualityUser.getCurrentName());
				}
			}
			
			if(constructionSchedulePO.getOilQualityId() != null && !"".equals(constructionSchedulePO.getOilQualityId())){
				UserPO oilQualityUser =  userDao.get(constructionSchedulePO.getOilQualityId());
				if(oilQualityUser != null){
					constructionScheduleVO.setOilQualityName(oilQualityUser.getCurrentName());
				}
			}
			
			if(constructionSchedulePO.getCleaningQualityId() != null && !"".equals(constructionSchedulePO.getCleaningQualityId())){
				UserPO cleaningQualityUser =  userDao.get(constructionSchedulePO.getCleaningQualityId());
				if(cleaningQualityUser != null){
					constructionScheduleVO.setCleaningQualityName(cleaningQualityUser.getCurrentName());
				}
			}
		}
		
		return constructionScheduleVO;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void saveOrUpdateConstructionSchedule(ConstructionScheduleVO constructionScheduleVO){
		
		ConstructionSchedulePO constructionSchedulePO = null;
		
		if(constructionScheduleVO.getCsId() == 0){
			constructionSchedulePO = new ConstructionSchedulePO();
		}else{
			constructionSchedulePO = constructionScheduleDao.get(constructionScheduleVO.getCsId());
		}
		BeanUtil.copyProperties(constructionScheduleVO, constructionSchedulePO);
		constructionScheduleDao.saveOrUpdate(constructionSchedulePO);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void saveOrUpdateConstructionScheduleByOrderId(ConstructionScheduleVO constructionScheduleVO){
		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByOrderId(constructionScheduleVO.getOrderId());
		
		if(constructionSchedulePO == null){
			constructionSchedulePO = new ConstructionSchedulePO();
			constructionSchedulePO.setDecorationOrderPO(new DecorationOrderPO(constructionScheduleVO.getOrderId()));
			constructionSchedulePO.setSchedule(ConstructionSchedulePO.SCHEDULE_TYPE_CHAN_INT);
		}
		
		BeanUtil.copyProperties(constructionScheduleVO, constructionSchedulePO);
		constructionScheduleDao.saveOrUpdate(constructionSchedulePO);
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(constructionScheduleVO.getOrderId());
		if(decorationOrderPO != null){
			if(constructionScheduleVO.getSupervisorQualityId() != null){
				decorationOrderPO.setSupervisorPO(new UserPO(constructionScheduleVO.getSupervisorQualityId()));
			}else{
				decorationOrderPO.setSupervisorPO(null);
			}
			
			decorationOrderDao.update(decorationOrderPO);
		}
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int checkConstructionScheduleForChanStatus(ConstructionScheduleVO constructionScheduleVO) throws FLException{
		
		long csId = constructionScheduleVO.getCsId();
		ChanConstructionSchedulePO chanConstructionSchedulePO = chanConstructionScheduleDao.queryChanConstructionScheduleByCsId(csId);
		
		if(chanConstructionSchedulePO != null){
			if(chanConstructionSchedulePO.getStatus() == ChanConstructionSchedulePO.STATUS_TYPE_DELAY_INT){
				ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.get(constructionScheduleVO.getCsId());
				
				if(constructionSchedulePO != null){
					
					MessagePO messagePO = new MessagePO();
					messagePO.setSender(new UserPO(constructionSchedulePO.getSupervisorQualityId()));
					messagePO.setReceiver(new UserPO(constructionSchedulePO.getChanQualityId()));
					messagePO.setType("施工进度消息");
					messagePO.setContents(String.format("装修订单编号%s施工进度中,铲大白状态需要标记为成功或者通过.", constructionSchedulePO.getDecorationOrderPO().getOrderId()));
					messagePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
					messagePO.setStatus("未读");
					messagePO.setArgs("");
					messageDao.saveOrUpdate(messagePO);
				}
				
				throw new FLException(120004, "铲大白状态需要标记为成功或者通过");
			}
		}
		
		return 0;
	}

	@Override
	public int checkFirstPayment(ConstructionScheduleVO constructionScheduleVO) throws FLException{
		
		String orderId = constructionScheduleVO.getOrderId();
		
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
	public int checkSecondPayment(ConstructionScheduleVO constructionScheduleVO) throws FLException{
		
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
	public int checkFinalyPayment(ConstructionScheduleVO constructionScheduleVO, String userId) throws FLException{
		
		String orderId = constructionScheduleVO.getOrderId();
		
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
					
					MessagePO messagePO = new MessagePO();
					messagePO.setSender(new UserPO(userId));
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
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void nextConstructionScheduleByOrderId(ConstructionScheduleVO constructionScheduleVO) throws FLException{
		
		String orderId = constructionScheduleVO.getOrderId();
		String currentTime = DateUtil.current(ChanConstructionSchedulePO.CURRENT_TIME_FORMAT_STR);
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(orderId);
		
		if(decorationOrderPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByOrderId(orderId);
		if(constructionSchedulePO == null){
			constructionSchedulePO = new ConstructionSchedulePO();
			constructionSchedulePO.setDecorationOrderPO(new DecorationOrderPO(orderId));
			constructionSchedulePO.setSchedule(ConstructionSchedulePO.SCHEDULE_TYPE_CHAN_INT);
		}else{
			int schedule = constructionScheduleVO.getSchedule();
			constructionSchedulePO.setSchedule(schedule);
		}
		constructionScheduleDao.saveOrUpdate(constructionSchedulePO);
		
		long csId = constructionSchedulePO.getCsId();
		int schedule = constructionSchedulePO.getSchedule();
		
		if(schedule == ConstructionSchedulePO.SCHEDULE_TYPE_CHAN_INT){
			ChanConstructionSchedulePO chanConstructionSchedulePO = chanConstructionScheduleDao.queryChanConstructionScheduleByCsId(csId);
			if(chanConstructionSchedulePO == null){
				chanConstructionSchedulePO = new ChanConstructionSchedulePO(csId, orderId, currentTime, currentTime);
				chanConstructionScheduleDao.save(chanConstructionSchedulePO);
			}
			
			decorationOrderPO.setProjectStatus(ChanConstructionSchedulePO.CHAN_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR);
		}else if(schedule == ConstructionSchedulePO.SCHEDULE_TYPE_PUTLINE_INT){
			PutlineConstructionSchedulePO putlineConstructionSchedulePO = putlineConstructionScheduleDao.queryConstructionScheduleByCsId(csId);
			if(putlineConstructionSchedulePO == null){
				putlineConstructionSchedulePO = new PutlineConstructionSchedulePO(csId, decorationOrderPO, currentTime, currentTime);
				
				//根据订单id查询放线实体
//				List<DrawLinePO> drawLinePOs = drawLineDao.queryDrawLineByOrderId(orderId);
//				if(drawLinePOs != null && drawLinePOs.size() > 0){
//					String drawLineGroup = drawLinePOs.get(0).getDrawLineGroup();
//					List<UserPO> userPOs = userDao.queryUserByUserName(drawLineGroup);
//					
//					if(userPOs.size() > 0){
//						putlineConstructionSchedulePO.setWorkerId(userPOs.get(0).getUserId());
//					}
//				}
				
				putlineConstructionScheduleDao.save(putlineConstructionSchedulePO);
			}
			
			decorationOrderPO.setProjectStatus(PutlineConstructionSchedulePO.PUBLINE_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR);
		}else if(schedule == ConstructionSchedulePO.SCHEDULE_TYPE_WATERWAYCIRCUIT_INT){
			WaterwayCircuitPowerConstructionSchedulePO waterwayCircuitPowerConstructionSchedulePO = waterwayCircuitPowerConstructionScheduleDao.queryCircuitPowerConstructionScheduleByCsId(csId);
			if(waterwayCircuitPowerConstructionSchedulePO == null){
				waterwayCircuitPowerConstructionSchedulePO = new WaterwayCircuitPowerConstructionSchedulePO(csId, orderId, currentTime, currentTime);
				
				waterwayCircuitPowerConstructionScheduleDao.save(waterwayCircuitPowerConstructionSchedulePO);
			}
			
			decorationOrderPO.setProjectStatus(WaterwayCircuitPowerConstructionSchedulePO.WATERWAYCIRCUITPOWER_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR);
		}else if(schedule == ConstructionSchedulePO.SCHEDULE_TYPE_BRICKLAY_INT){
			BricklayConstructionSchedulePO bricklayConstructionSchedulePO = bricklayConstructionScheduleDao.queryBricklayConstructionScheduleByCsId(csId);
			
			if(bricklayConstructionSchedulePO == null){
				bricklayConstructionSchedulePO = new BricklayConstructionSchedulePO(csId, orderId, currentTime, currentTime);
				
				bricklayConstructionScheduleDao.save(bricklayConstructionSchedulePO);
			}
			
			decorationOrderPO.setProjectStatus(BricklayConstructionSchedulePO.BRICKLAY_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR);
		}else if(schedule == ConstructionSchedulePO.SCHEDULE_TYPE_GROUNDLEVELING_INT){
			GroundLevelingConstructionSchedulePO groundLevelingConstructionSchedulePO = groundLevelingConstructionScheduleDao.queryGroundLevelingConstructionScheduleByCsId(csId);
			
			if(groundLevelingConstructionSchedulePO == null){
				groundLevelingConstructionSchedulePO = new GroundLevelingConstructionSchedulePO(csId, orderId, currentTime, currentTime);
				
				groundLevelingConstructionScheduleDao.save(groundLevelingConstructionSchedulePO);
			}
			
			decorationOrderPO.setProjectStatus(GroundLevelingConstructionSchedulePO.GROUNDLEVELING_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR);
		}else if(schedule == ConstructionSchedulePO.SCHEDULE_TYPE_CARPENT_INT){
			CarpentConstructionSchedulePO carpentConstructionSchedulePO = carpentConstructionScheduleDao.queryCarpentConstructionScheduleByCsId(csId);
			
			if(carpentConstructionSchedulePO == null){
				carpentConstructionSchedulePO = new CarpentConstructionSchedulePO(csId, orderId, currentTime, currentTime);
				
				carpentConstructionScheduleDao.saveOrUpdate(carpentConstructionSchedulePO);
			}
			
			decorationOrderPO.setProjectStatus(CarpentConstructionSchedulePO.CARPENT_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR);
		}else if(schedule == ConstructionSchedulePO.SCHEDULE_TYPE_OIL_INT){
			OilConstructionSchedulePO oilConstructionSchedulePO = oilConstructionScheduleDao.queryConstructionScheduleByCsId(csId);
			
			if(oilConstructionSchedulePO == null){
				oilConstructionSchedulePO = new OilConstructionSchedulePO(csId, orderId, currentTime, currentTime);
				
				oilConstructionScheduleDao.saveOrUpdate(oilConstructionSchedulePO);
			}
			
			decorationOrderPO.setProjectStatus(OilConstructionSchedulePO.OIL_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR);
		}else if(schedule == ConstructionSchedulePO.SCHEDULE_TYPE_WATERWAYCIRCUITCHECK_INT){
			WaterwayCircuitCheckConstructionSchedulePO waterwayCircuitCheckConstructionSchedulePO = waterwayCircuitCheckConstructionScheduleDao.queryWaterwayCircuitCheckConstructionScheduleByCsId(csId);
			
			if(waterwayCircuitCheckConstructionSchedulePO == null){
				waterwayCircuitCheckConstructionSchedulePO = new WaterwayCircuitCheckConstructionSchedulePO(csId, orderId, currentTime, currentTime);
				
				waterwayCircuitCheckConstructionScheduleDao.saveOrUpdate(waterwayCircuitCheckConstructionSchedulePO);
			}
			
			decorationOrderPO.setProjectStatus(WaterwayCircuitCheckConstructionSchedulePO.WATERWAYCIRCUITCHECK_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR);
		}else if(schedule == ConstructionSchedulePO.SCHEDULE_TYPE_CLEANING_INT){
			CleaningConstructionSchedulePO cleaningConstructionSchedulePO = cleaningConstructionScheduleDao.queryCleaningConstructionScheduleByCsId(csId);
			
			if(cleaningConstructionSchedulePO == null){
				cleaningConstructionSchedulePO = new CleaningConstructionSchedulePO(csId, orderId, currentTime, currentTime);
				
				cleaningConstructionScheduleDao.saveOrUpdate(cleaningConstructionSchedulePO);
			}
			
			decorationOrderPO.setProjectStatus(CleaningConstructionSchedulePO.CLEANING_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR);
		}
		
		decorationOrderDao.update(decorationOrderPO);
	}
	
	//之前pageDecorationOrderForConstructionScheduleByPlace用到这个方法，然后这个方法删除了 
//	private void pageOrderByUserIdAWorkType(Paging paging, List<Filter> filters, String workTypeQuality, String userId){
//		
//		List<ConstructionSchedulePO> constructionSchedulePOs = constructionScheduleDao.pageConstructionScheduleForSupervisionByUserId(paging, filters, workTypeQuality, userId);
//		List<DecorationOrderVO> decorationOrderVOs = new ArrayList<DecorationOrderVO>();
//		
//		for(ConstructionSchedulePO constructionSchedulePO: constructionSchedulePOs){
//			decorationOrderVOs.add(decorationOrderPOToVO(constructionSchedulePO.getDecorationOrderPO()));
//		}
//		
//		paging.setData(decorationOrderVOs);
//	}
	
	private DecorationOrderVO decorationOrderPOToVO(DecorationOrderPO decorationOrderPO){
		
		DecorationOrderVO decorationOrderVO = new DecorationOrderVO();
		BeanUtil.copyProperties(decorationOrderPO, decorationOrderVO);
		
		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(decorationOrderPO.getOrderId(), decorationOrderPO.getType());
		
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
			messagePO.setSender(new UserPO(qualityId));
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
