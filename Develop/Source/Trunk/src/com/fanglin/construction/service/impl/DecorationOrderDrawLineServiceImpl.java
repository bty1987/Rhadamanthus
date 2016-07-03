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

package com.fanglin.construction.service.impl;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.BricklayConstructionScheduleDao;
import com.fanglin.construction.dao.CarpentConstructionScheduleDao;
import com.fanglin.construction.dao.ChanConstructionScheduleDao;
import com.fanglin.construction.dao.CleaningConstructionScheduleDao;
import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.dao.DecorationOrderDrawLineDao;
import com.fanglin.construction.dao.GroundLevelingConstructionScheduleDao;
import com.fanglin.construction.dao.OilConstructionScheduleDao;
import com.fanglin.construction.dao.PutlineConstructionScheduleDao;
import com.fanglin.construction.dao.WaterwayCircuitCheckConstructionScheduleDao;
import com.fanglin.construction.dao.WaterwayCircuitPowerConstructionScheduleDao;
import com.fanglin.construction.po.BricklayConstructionSchedulePO;
import com.fanglin.construction.po.CarpentConstructionSchedulePO;
import com.fanglin.construction.po.ChanConstructionSchedulePO;
import com.fanglin.construction.po.CleaningConstructionSchedulePO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.construction.po.DecorationOrderDrawLinePO;
import com.fanglin.construction.po.GroundLevelingConstructionSchedulePO;
import com.fanglin.construction.po.OilConstructionSchedulePO;
import com.fanglin.construction.po.PutlineConstructionSchedulePO;
import com.fanglin.construction.po.WaterwayCircuitCheckConstructionSchedulePO;
import com.fanglin.construction.po.WaterwayCircuitPowerConstructionSchedulePO;
import com.fanglin.construction.service.DecorationOrderDrawLineService;
import com.fanglin.construction.vo.DecorationOrderDrawLineVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.data.common.vo.CustomerVO;
import com.fanglin.data.common.vo.VillageVO;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.decoration.vo.DecorationOrderVO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.information.vo.MessageVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("decorationOrderDrawLineService")
@Transactional(readOnly=true)
public class DecorationOrderDrawLineServiceImpl implements DecorationOrderDrawLineService {

	protected Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private DecorationOrderDao decorationOrderDao;
	
	@Autowired
	private DecorationOrderDrawLineDao decorationOrderDrawLineDao;
	
	@Autowired
	private QuotationDao quotationDao;
	
	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;
	
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
	
	@Autowired
	private MessageService messageService;
	
	@Override
	public void pageDecorationOrderByPersonInfo(Paging paging, List<FilterVO> filters){
		
		if(filters.size() == 0) return ;
		
		List<DecorationOrderPO> decorationOrderPOs = decorationOrderDao.pageDecorationOrder(paging, filters, null, null);
		List<DecorationOrderVO> decorationOrderVOs = decorationOrderPOToVO(decorationOrderPOs);
		
		paging.setData(decorationOrderVOs);
	}

	@Override
	public List<DecorationOrderDrawLineVO>  pageDecorationOrderDrawLine(Paging paging,List<FilterVO> filters){
		
		List<DecorationOrderDrawLinePO> decorationOrderDrawLinePOs = decorationOrderDrawLineDao.pageDecorationOrderDrawLine(paging, filters);
		List<DecorationOrderDrawLineVO> decorationOrderDrawLineVOs = new ArrayList<DecorationOrderDrawLineVO>();
		
		for(DecorationOrderDrawLinePO decorationOrderDrawLinePO: decorationOrderDrawLinePOs){
			DecorationOrderDrawLineVO decorationOrderDrawLineVO = new DecorationOrderDrawLineVO();
			BeanUtil.copyProperties(decorationOrderDrawLinePO, decorationOrderDrawLineVO);

			if(decorationOrderDrawLinePO.getOrderPO().getOrderTotalPrice() == null){
				decorationOrderDrawLineVO.setOrderTotalPrice((float) 0);
			}else{
				decorationOrderDrawLineVO.setOrderTotalPrice(decorationOrderDrawLinePO.getOrderPO().getOrderTotalPrice());
			}
			
			decorationOrderDrawLineVO.setOrderId(decorationOrderDrawLinePO.getOrderPO().getOrderId());
			decorationOrderDrawLineVO.setCustomer(decorationOrderDrawLinePO.getOrderPO().getCustomerPO().getCustomerName());
			decorationOrderDrawLineVO.setDesigner(decorationOrderDrawLinePO.getOrderPO().getDesignerPO().getCurrentName());
			decorationOrderDrawLineVO.setOrderStatus(decorationOrderDrawLinePO.getOrderPO().getStatus());
			decorationOrderDrawLineVO.setVersionId(decorationOrderDrawLinePO.getOrderPO().getVersionPO().getVersionId());
			decorationOrderDrawLineVO.setVersionName(decorationOrderDrawLinePO.getOrderPO().getVersionPO().getVersionName());
			decorationOrderDrawLineVO.setVillage(decorationOrderDrawLinePO.getOrderPO().getVillagePO().getVillageName());
			decorationOrderDrawLineVO.setCityProper(decorationOrderDrawLinePO.getOrderPO().getVillagePO().getCityProper().getCityProperName());
			decorationOrderDrawLineVO.setHouseNumber(decorationOrderDrawLinePO.getOrderPO().getHouseNumber());
			decorationOrderDrawLineVO.setHouseArea(decorationOrderDrawLinePO.getOrderPO().getHouseArea());
			decorationOrderDrawLineVO.setContractTime(decorationOrderDrawLinePO.getOrderPO().getContractTime());
			
			decorationOrderDrawLineVO.setApplayUser(decorationOrderDrawLinePO.getApplayUserPO().getCurrentName());
			decorationOrderDrawLineVO.setApplayUserId(decorationOrderDrawLinePO.getApplayUserPO().getUserId());
			
			SimpleDateFormat  dateFormat = new SimpleDateFormat("yyyy-MM-dd");
			SimpleDateFormat  dateFormath = new SimpleDateFormat("HH:mm");
			
			if(decorationOrderDrawLinePO.getActualStartTime() != null){
				decorationOrderDrawLineVO.setActualDate(dateFormat.format(decorationOrderDrawLinePO.getActualEndTime()));
				decorationOrderDrawLineVO.setEndTime((dateFormath.format(decorationOrderDrawLinePO.getActualEndTime())));
				decorationOrderDrawLineVO.setStartTime(dateFormath.format(decorationOrderDrawLinePO.getActualStartTime()));
			}
			
			if(decorationOrderDrawLinePO.getDrawLineUserPO()!=null){
				decorationOrderDrawLineVO.setDrawLineUser(decorationOrderDrawLinePO.getDrawLineUserPO().getCurrentName());
				decorationOrderDrawLineVO.setDrawLineUserId(decorationOrderDrawLinePO.getDrawLineUserPO().getUserId());
			}
			
			QuotationPO qs = quotationDao.queryQuotationForDefaultByOrderId(decorationOrderDrawLinePO.getOrderPO().getOrderId());
			if(qs == null){
				decorationOrderDrawLineVO.setDiscount((float) 10);
			}else{
				decorationOrderDrawLineVO.setDiscount(qs.getDiscount());
			}
			
			if(decorationOrderDrawLinePO.getOrderPO().getSupervisorPO() != null){
				decorationOrderDrawLineVO.setOrderSupervisor(decorationOrderDrawLinePO.getOrderPO().getSupervisorPO().getCurrentName());
			}
			
			decorationOrderDrawLineVOs.add(decorationOrderDrawLineVO);
		}
		
		paging.setData(decorationOrderDrawLineVOs);
		
		return decorationOrderDrawLineVOs;
	}
	
	@Override
	public List<DecorationOrderDrawLineVO> queryDecorationOrderDrawLine(List<FilterVO> filters) {
		
		List<DecorationOrderDrawLineVO> decorationOrderDrawLineVOs = new ArrayList<DecorationOrderDrawLineVO>();
		
		if(filters.size() == 0) return decorationOrderDrawLineVOs;
		
		List<DecorationOrderDrawLinePO> decorationOrderDrawLinePOs = decorationOrderDrawLineDao.queryDecorationOrderDrawLine(filters);
		
		for(DecorationOrderDrawLinePO decorationOrderDrawLinePO: decorationOrderDrawLinePOs){
			DecorationOrderDrawLineVO decorationOrderDrawLineVO = new DecorationOrderDrawLineVO();
			BeanUtil.copyProperties(decorationOrderDrawLinePO, decorationOrderDrawLineVO);

			if(decorationOrderDrawLinePO.getOrderPO().getOrderTotalPrice() == null){
				decorationOrderDrawLineVO.setOrderTotalPrice((float) 0);
			}else{
				decorationOrderDrawLineVO.setOrderTotalPrice(decorationOrderDrawLinePO.getOrderPO().getOrderTotalPrice());
			}
			
			decorationOrderDrawLineVO.setOrderId(decorationOrderDrawLinePO.getOrderPO().getOrderId());
			decorationOrderDrawLineVO.setCustomer(decorationOrderDrawLinePO.getOrderPO().getCustomerPO().getCustomerName());
			decorationOrderDrawLineVO.setDesigner(decorationOrderDrawLinePO.getOrderPO().getDesignerPO().getCurrentName());
			decorationOrderDrawLineVO.setOrderStatus(decorationOrderDrawLinePO.getOrderPO().getStatus());
			decorationOrderDrawLineVO.setVersionId(decorationOrderDrawLinePO.getOrderPO().getVersionPO().getVersionId());
			decorationOrderDrawLineVO.setVersionName(decorationOrderDrawLinePO.getOrderPO().getVersionPO().getVersionName());
			decorationOrderDrawLineVO.setVillage(decorationOrderDrawLinePO.getOrderPO().getVillagePO().getVillageName());
			decorationOrderDrawLineVO.setCityProper(decorationOrderDrawLinePO.getOrderPO().getVillagePO().getCityProper().getCityProperName());
			decorationOrderDrawLineVO.setHouseNumber(decorationOrderDrawLinePO.getOrderPO().getHouseNumber());
			decorationOrderDrawLineVO.setHouseArea(decorationOrderDrawLinePO.getOrderPO().getHouseArea());
			decorationOrderDrawLineVO.setContractTime(decorationOrderDrawLinePO.getOrderPO().getContractTime());
			
			decorationOrderDrawLineVO.setApplayUser(decorationOrderDrawLinePO.getApplayUserPO().getCurrentName());
			decorationOrderDrawLineVO.setApplayUserId(decorationOrderDrawLinePO.getApplayUserPO().getUserId());
			
			SimpleDateFormat  dateFormat = new SimpleDateFormat("yyyy-MM-dd");
			SimpleDateFormat  dateFormath = new SimpleDateFormat("HH:mm");
			
			if(decorationOrderDrawLinePO.getActualStartTime() != null){
				decorationOrderDrawLineVO.setActualDate(dateFormat.format(decorationOrderDrawLinePO.getActualEndTime()));
				decorationOrderDrawLineVO.setEndTime((dateFormath.format(decorationOrderDrawLinePO.getActualEndTime())));
				decorationOrderDrawLineVO.setStartTime(dateFormath.format(decorationOrderDrawLinePO.getActualStartTime()));
			}
			
			if(decorationOrderDrawLinePO.getDrawLineUserPO()!=null){
				decorationOrderDrawLineVO.setDrawLineUser(decorationOrderDrawLinePO.getDrawLineUserPO().getCurrentName());
				decorationOrderDrawLineVO.setDrawLineUserId(decorationOrderDrawLinePO.getDrawLineUserPO().getUserId());
			}
			
			QuotationPO qs = quotationDao.queryQuotationForDefaultByOrderId(decorationOrderDrawLinePO.getOrderPO().getOrderId());
			if(qs == null){
				decorationOrderDrawLineVO.setDiscount((float) 10);
			}else{
				decorationOrderDrawLineVO.setDiscount(qs.getDiscount());
			}
			
			if(decorationOrderDrawLinePO.getOrderPO().getSupervisorPO() != null){
				decorationOrderDrawLineVO.setOrderSupervisor(decorationOrderDrawLinePO.getOrderPO().getSupervisorPO().getCurrentName());
			}
			
			decorationOrderDrawLineVOs.add(decorationOrderDrawLineVO);
		}
		
		return decorationOrderDrawLineVOs;
	}

	@Override
	public HashMap<String, HashMap<String,Integer>> queryDecorationOrderDrawLineForCountByDate(DecorationOrderDrawLineVO decorationOrderDrawLineVO){
		
		Timestamp startTime = DateUtil.getDateToTimestamp(DateUtil.getFirstDay(DateUtil.parseDate(decorationOrderDrawLineVO.getStartTime(), "yyyy-MM-dd HH:mm:ss")));
		Timestamp endTime = DateUtil.getDateToTimestamp(DateUtil.getLastDay(DateUtil.parseDate(decorationOrderDrawLineVO.getEndTime(), "yyyy-MM-dd HH:mm:ss")));
		
		HashMap<String, HashMap<String,Integer>> drawLineInfos = new HashMap<String, HashMap<String,Integer>>();
		List<DecorationOrderDrawLinePO> decorationOrderDrawLinePOs = decorationOrderDrawLineDao.queryDecorationOrderDrawLine(startTime, endTime);
		
		for(DecorationOrderDrawLinePO decorationOrderDrawLinePO : decorationOrderDrawLinePOs){
			String d = DateUtil.getDateToDateString(decorationOrderDrawLinePO.getActualStartTime(), "yyyy-MM-dd");
			
			if(drawLineInfos.get(d) != null){
				HashMap<String,Integer> groupCount = drawLineInfos.get(d);
				if(groupCount.get(decorationOrderDrawLinePO.getDrawLineGroup())!=null){
					groupCount.put(decorationOrderDrawLinePO.getDrawLineGroup(), groupCount.get(decorationOrderDrawLinePO.getDrawLineGroup()).intValue()+1);
				}else{
					groupCount.put(decorationOrderDrawLinePO.getDrawLineGroup(), 1);
				}
			}else{
				HashMap<String,Integer> groupCount = new HashMap<String, Integer>();
				groupCount.put(decorationOrderDrawLinePO.getDrawLineGroup(), 1);
				drawLineInfos.put(d, groupCount);
			}
		}
		
		return drawLineInfos;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int applayDecorationOrderDrawLine(DecorationOrderDrawLineVO decorationOrderDrawLineVO) throws FLException{
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryOrderByOrderId(decorationOrderDrawLineVO.getOrderId());
		List<DecorationOrderDrawLinePO> decorationOrderDrawLinePOs = decorationOrderDrawLineDao.queryDecorationOrderDrawLineByOrderId(decorationOrderDrawLineVO.getOrderId());
		
		DecorationOrderDrawLinePO decorationOrderDrawLinePO = null;
		DecorationOrderDrawLinePO newDrawLine = new DecorationOrderDrawLinePO();
		
		newDrawLine.setApplayCount(0);
		
		if(decorationOrderDrawLinePOs != null && decorationOrderDrawLinePOs.size() > 0){
			decorationOrderDrawLinePO = decorationOrderDrawLinePOs.get(0);
			if(!decorationOrderDrawLinePO.getStatus().equals("放线失败")){
				throw new FLException(120013, "已经在队列中,不可重复提交");
			}
			newDrawLine.setApplayCount(decorationOrderDrawLinePO.getApplayCount()+1);
		}
		
		newDrawLine.setApplayTime(decorationOrderDrawLineVO.getApplayTime());
		newDrawLine.setOrderPO(decorationOrderPO);
		newDrawLine.setApplayUserPO(new UserPO(decorationOrderDrawLineVO.getApplayUserId()));
		newDrawLine.setStatus("排队");
		newDrawLine.setApplayDes(decorationOrderDrawLineVO.getApplayDes());
		
		decorationOrderDrawLineDao.saveOrUpdate(newDrawLine);

		decorationOrderPO.setProjectStatus(ChanConstructionSchedulePO.CHAN_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR);
		decorationOrderDao.update(decorationOrderPO);

		String orderId = decorationOrderDrawLineVO.getOrderId();
		String currentTime = DateUtil.current(ChanConstructionSchedulePO.CURRENT_TIME_FORMAT_STR);
		
		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByOrderId(decorationOrderDrawLineVO.getOrderId());
		
		if(constructionSchedulePO == null){
			constructionSchedulePO = new ConstructionSchedulePO();
			constructionSchedulePO.setDecorationOrderPO(new DecorationOrderPO(decorationOrderDrawLineVO.getOrderId()));
			constructionSchedulePO.setSchedule(ConstructionSchedulePO.SCHEDULE_TYPE_CHAN_INT);
			constructionScheduleDao.save(constructionSchedulePO);
		}else{
			constructionSchedulePO.setSchedule(ConstructionSchedulePO.SCHEDULE_TYPE_CHAN_INT);
			constructionScheduleDao.update(constructionSchedulePO);
		}
		
		int csId = constructionSchedulePO.getCsId();
		
		ChanConstructionSchedulePO chanConstructionSchedulePO = chanConstructionScheduleDao.queryChanConstructionScheduleByOrderId(orderId);
		
		if(chanConstructionSchedulePO != null){
			chanConstructionSchedulePO.setStartTimeFlag(ChanConstructionSchedulePO.STARTTIMEFLAG_TYPE_INIT_INT);
			chanConstructionSchedulePO.setEndTimeFlag(ChanConstructionSchedulePO.ENDTIMEFLAG_TYPE_INIT_INT);
			chanConstructionSchedulePO.setStatus(ChanConstructionSchedulePO.STATUS_TYPE_INIT_INT);
			
			chanConstructionScheduleDao.update(chanConstructionSchedulePO);
		}else{
			chanConstructionSchedulePO = new ChanConstructionSchedulePO(csId, orderId, currentTime, currentTime);
			
			chanConstructionScheduleDao.saveOrUpdate(chanConstructionSchedulePO);
		}
		
		PutlineConstructionSchedulePO putlineConstructionSchedulePO = putlineConstructionScheduleDao.queryConstructionScheduleByOrderId(orderId);
		
		if(putlineConstructionSchedulePO != null){
			putlineConstructionSchedulePO.setPutlineStatus(PutlineConstructionSchedulePO.PUTLINESTATUS_TYPE_INIT_INT);
			putlineConstructionScheduleDao.update(putlineConstructionSchedulePO);
		}else{
				putlineConstructionSchedulePO = new PutlineConstructionSchedulePO(csId, decorationOrderPO, currentTime, currentTime);
				
				putlineConstructionScheduleDao.save(putlineConstructionSchedulePO);
		}
		
		WaterwayCircuitPowerConstructionSchedulePO waterwayCircuitPowerConstructionSchedulePO = waterwayCircuitPowerConstructionScheduleDao.queryCircuitPowerConstructionScheduleByOrderId(orderId);
		
		if(waterwayCircuitPowerConstructionSchedulePO == null){
			waterwayCircuitPowerConstructionSchedulePO = new WaterwayCircuitPowerConstructionSchedulePO(csId, orderId, currentTime, currentTime);;
			
			waterwayCircuitPowerConstructionScheduleDao.saveOrUpdate(waterwayCircuitPowerConstructionSchedulePO);
		}
		
		BricklayConstructionSchedulePO bricklayConstructionSchedulePO = bricklayConstructionScheduleDao.queryBricklayConstructionScheduleByCsId(csId);
		
		if(bricklayConstructionSchedulePO == null){
			bricklayConstructionSchedulePO = new BricklayConstructionSchedulePO(csId, orderId, currentTime, currentTime);
			
			bricklayConstructionScheduleDao.save(bricklayConstructionSchedulePO);
		}
		
		GroundLevelingConstructionSchedulePO groundLevelingConstructionSchedulePO = groundLevelingConstructionScheduleDao.queryGroundLevelingConstructionScheduleByCsId(csId);
		
		if(groundLevelingConstructionSchedulePO == null){
			groundLevelingConstructionSchedulePO = new GroundLevelingConstructionSchedulePO(csId, orderId, currentTime, currentTime);
			
			groundLevelingConstructionScheduleDao.save(groundLevelingConstructionSchedulePO);
		}
		
		CarpentConstructionSchedulePO carpentConstructionSchedulePO = carpentConstructionScheduleDao.queryCarpentConstructionScheduleByCsId(csId);
		
		if(carpentConstructionSchedulePO == null){
			carpentConstructionSchedulePO = new CarpentConstructionSchedulePO(csId, orderId, currentTime, currentTime);
			
			carpentConstructionScheduleDao.saveOrUpdate(carpentConstructionSchedulePO);
		}
		
		OilConstructionSchedulePO oilConstructionSchedulePO = oilConstructionScheduleDao.queryConstructionScheduleByOrderId(orderId);
		
		if(oilConstructionSchedulePO == null){
			oilConstructionSchedulePO = new OilConstructionSchedulePO(csId, orderId, currentTime, currentTime);
			
			oilConstructionScheduleDao.saveOrUpdate(oilConstructionSchedulePO);
		}
		
		WaterwayCircuitCheckConstructionSchedulePO waterwayCircuitCheckConstructionSchedulePO = waterwayCircuitCheckConstructionScheduleDao.queryWaterwayCircuitCheckConstructionScheduleByOrderId(orderId);
		
		if(waterwayCircuitCheckConstructionSchedulePO == null){
			waterwayCircuitCheckConstructionSchedulePO = new WaterwayCircuitCheckConstructionSchedulePO(csId, orderId, currentTime, currentTime);
			
			waterwayCircuitCheckConstructionScheduleDao.saveOrUpdate(waterwayCircuitCheckConstructionSchedulePO);
		}
		
		CleaningConstructionSchedulePO cleaningConstructionSchedulePO = cleaningConstructionScheduleDao.queryCleaningConstructionScheduleByOrderId(orderId);
		
		if(cleaningConstructionSchedulePO == null){
			cleaningConstructionSchedulePO = new CleaningConstructionSchedulePO(csId, orderId, currentTime, currentTime);
			
			cleaningConstructionScheduleDao.saveOrUpdate(cleaningConstructionSchedulePO);
		}
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int editDecorationOrderDrawLine(DecorationOrderDrawLineVO drawLine) throws FLException{
		
		DecorationOrderDrawLinePO decorationOrderDrawLinePO = decorationOrderDrawLineDao.get(drawLine.getAutoId());
		if(decorationOrderDrawLinePO == null){
			throw new FLException(120014, "不存在该放线信息");
		}
		
		Date date = DateUtil.parseDate(drawLine.getActualDate() + " " + drawLine.getEndTime() , "yyyy-MM-dd HH:mm");
		Timestamp end = DateUtil.getDateToTimestamp(date);
		date = DateUtil.parseDate(drawLine.getActualDate() + " " + drawLine.getStartTime() , "yyyy-MM-dd HH:mm");
		Timestamp start = DateUtil.getDateToTimestamp(date);
		
		List<DecorationOrderDrawLinePO> decorationOrderDrawLinePOs = decorationOrderDrawLineDao.queryDecorationOrderDrawLineByGroupATime(drawLine.getDrawLineGroup(), start, end);
		if(decorationOrderDrawLinePOs!=null&& decorationOrderDrawLinePOs.size() > 0){
			if(!(decorationOrderDrawLinePOs.size() == 1 && decorationOrderDrawLinePOs.get(0).getOrderPO().getOrderId().equals(decorationOrderDrawLinePO.getOrderPO().getOrderId()))){
				throw new FLException(120015, "时间重叠不能申请放线计划");
			}
		}

		decorationOrderDrawLinePO.setStatus("申请放线");
		decorationOrderDrawLinePO.setActualEndTime(end);
		decorationOrderDrawLinePO.setActualStartTime(start);
		decorationOrderDrawLinePO.setDrawLineGroup(drawLine.getDrawLineGroup());
		
		decorationOrderDrawLineDao.saveOrUpdate(decorationOrderDrawLinePO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int saveDecorationOrderDrawLineForStatus(DecorationOrderDrawLineVO decorationOrderDrawLineVO,String userId) throws FLException{
		DecorationOrderDrawLinePO decorationOrderDrawLinePO = decorationOrderDrawLineDao.get(decorationOrderDrawLineVO.getAutoId());
		
		MessageVO message = new MessageVO();
		
		if(decorationOrderDrawLinePO == null){
			throw new FLException(120016, "不存在该放线信息");
		}
		
		String statusForPO = decorationOrderDrawLinePO.getStatus();
		String statusForVO = decorationOrderDrawLineVO.getStatus();
		
		if(("分配工人".equals(statusForVO) && "申请放线".equals(statusForPO)) || 
				("放线失败".equals(statusForVO) && "申请放线".equals(statusForPO)) || 
				("排队".equals(statusForVO) && "放线失败".equals(statusForPO)) || 
				("放线成功".equals(statusForVO) && "分配工人".equals(statusForPO)) || 
				("放线失败".equals(statusForVO) && "分配工人".equals(statusForPO))){
			
			decorationOrderDrawLinePO.setStatus(decorationOrderDrawLineVO.getStatus());
			
			if(decorationOrderDrawLineVO.getStatus().equals("放线失败")){
				message.setSender(new UserVO(userId));
				message.setReceiver(new UserVO(decorationOrderDrawLinePO.getOrderPO().getDesignerPO().getUserId()));
				message.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
				message.setType(MessagePO.MESSAGE_TYPE_DELIVER_STR);
				message.setContents("订单："+decorationOrderDrawLinePO.getOrderPO().getOrderId()+" 放线失败！请重新申请放线。");
				
				messageService.sendMessage(message);
			}
		}else{
			throw new FLException(120017, "订单放线状态错误");
		}

		decorationOrderDrawLineDao.saveOrUpdate(decorationOrderDrawLinePO);
		return 0;
	}
	
	private List<DecorationOrderVO> decorationOrderPOToVO(List<DecorationOrderPO> decorationOrderPOs){
		
		List<DecorationOrderVO> decorationOrderVOs = new ArrayList<DecorationOrderVO>();
		
		for(DecorationOrderPO decorationOrderPO: decorationOrderPOs){
			DecorationOrderVO decorationOrderVO = new DecorationOrderVO();
			BeanUtil.copyProperties(decorationOrderPO, decorationOrderVO);
			
			if(decorationOrderVO.getOrderTotalPrice() == null || decorationOrderVO.getOrderTotalPrice()==0){
				
				QuotationPO tem = quotationDao.queryQuotationForDefaultByOrderId(decorationOrderPO.getOrderId());
				if(tem==null){
					decorationOrderVO.setOrderTotalPrice(new Float(0));
				}else{
					decorationOrderVO.setOrderTotalPrice(tem.getTotalPrice());
				}
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
		
		return decorationOrderVOs;
	}
}