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

package com.fanglin.drawline.service.impl;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
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
import com.fanglin.construction.po.GroundLevelingConstructionSchedulePO;
import com.fanglin.construction.po.OilConstructionSchedulePO;
import com.fanglin.construction.po.PutlineConstructionSchedulePO;
import com.fanglin.construction.po.WaterwayCircuitCheckConstructionSchedulePO;
import com.fanglin.construction.po.WaterwayCircuitPowerConstructionSchedulePO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.drawline.dao.DrawLineDao;
import com.fanglin.drawline.po.DrawLinePO;
import com.fanglin.drawline.service.DrawLineService;
import com.fanglin.drawline.vo.DrawLineVO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.information.vo.MessageVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("decorationOrderDrawLineService")
@Transactional(readOnly=true)
public class DrawLineServiceImpl implements DrawLineService {

	protected Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private DecorationOrderDao decorationOrderDao;
	
	@Autowired
	private DrawLineDao drawlineDao;
	
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
	public List<DrawLineVO>  pageDrawLine(Paging paging,List<FilterVO> filters){
		
		List<DrawLinePO> drawLinePOs = drawlineDao.pageDrawLine(paging, filters);
		List<DrawLineVO> drawLineVOs = new ArrayList<DrawLineVO>();
		
		for(DrawLinePO drawLinePO: drawLinePOs){
			DrawLineVO drawLineVO = new DrawLineVO();
			BeanUtil.copyProperties(drawLinePO, drawLineVO);
			
			DecorationOrderPO decorationOrderPO = drawLinePO.getDecorationOrderPO();

			if(decorationOrderPO.getOrderTotalPrice() == null){
				drawLineVO.setOrderTotalPrice((float) 0);
			}else{
				drawLineVO.setOrderTotalPrice(decorationOrderPO.getOrderTotalPrice());
			}
			
			drawLineVO.setOrderId(decorationOrderPO.getOrderId());
			drawLineVO.setCustomer(decorationOrderPO.getCustomerPO().getCustomerName());
			drawLineVO.setDesigner(decorationOrderPO.getDesignerPO().getCurrentName());
			drawLineVO.setOrderStatus(decorationOrderPO.getStatus());
			drawLineVO.setVersionId(decorationOrderPO.getVersionPO().getVersionId());
			drawLineVO.setVersionName(decorationOrderPO.getVersionPO().getVersionName());
			drawLineVO.setVillage(decorationOrderPO.getVillagePO().getVillageName());
			drawLineVO.setCityProper(decorationOrderPO.getVillagePO().getCityProper().getCityProperName());
			drawLineVO.setHouseNumber(decorationOrderPO.getHouseNumber());
			drawLineVO.setHouseArea(decorationOrderPO.getHouseArea());
			drawLineVO.setContractTime(decorationOrderPO.getContractTime());
			
			drawLineVO.setApplayUser(drawLinePO.getApplayUserPO().getCurrentName());
			drawLineVO.setApplayUserId(drawLinePO.getApplayUserPO().getUserId());
			
			SimpleDateFormat  dateFormat = new SimpleDateFormat("yyyy-MM-dd");
			SimpleDateFormat  dateFormath = new SimpleDateFormat("HH:mm");
			
			if(drawLinePO.getActualStartTime() != null){
				drawLineVO.setActualDate(dateFormat.format(drawLinePO.getActualEndTime()));
				drawLineVO.setEndTime((dateFormath.format(drawLinePO.getActualEndTime())));
				drawLineVO.setStartTime(dateFormath.format(drawLinePO.getActualStartTime()));
			}
			
			if(drawLinePO.getDrawLineUserPO()!=null){
				drawLineVO.setDrawLineUser(drawLinePO.getDrawLineUserPO().getCurrentName());
				drawLineVO.setDrawLineUserId(drawLinePO.getDrawLineUserPO().getUserId());
			}
			
			QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(decorationOrderPO.getOrderId());
			if(quotationPO == null){
				drawLineVO.setDiscount((float) 10);
			}else{
				drawLineVO.setDiscount(quotationPO.getDiscount());
			}
			
			if(decorationOrderPO.getSupervisorPO() != null){
				drawLineVO.setSupervisor(decorationOrderPO.getSupervisorPO().getCurrentName());
			}
			
			drawLineVOs.add(drawLineVO);
		}
		
		paging.setData(drawLineVOs);
		
		return drawLineVOs;
	}
	
	@Override
	public List<DrawLineVO> queryDrawLine(List<FilterVO> filters) {
		
		List<DrawLineVO> drawLineVOs = new ArrayList<DrawLineVO>();
		
		if(filters.size() == 0) return drawLineVOs;
		
		List<DrawLinePO> drawLinePOs = drawlineDao.queryDrawLine(filters);
		
		for(DrawLinePO drawLinePO: drawLinePOs){
			DrawLineVO drawLineVO = new DrawLineVO();
			BeanUtil.copyProperties(drawLinePO, drawLineVO);
			
			DecorationOrderPO decorationOrderPO = drawLinePO.getDecorationOrderPO();

			if(decorationOrderPO.getOrderTotalPrice() == null){
				drawLineVO.setOrderTotalPrice((float) 0);
			}else{
				drawLineVO.setOrderTotalPrice(decorationOrderPO.getOrderTotalPrice());
			}
			
			drawLineVO.setOrderId(decorationOrderPO.getOrderId());
			drawLineVO.setCustomer(decorationOrderPO.getCustomerPO().getCustomerName());
			drawLineVO.setDesigner(decorationOrderPO.getDesignerPO().getCurrentName());
			drawLineVO.setOrderStatus(decorationOrderPO.getStatus());
			drawLineVO.setVersionId(decorationOrderPO.getVersionPO().getVersionId());
			drawLineVO.setVersionName(decorationOrderPO.getVersionPO().getVersionName());
			drawLineVO.setVillage(decorationOrderPO.getVillagePO().getVillageName());
			drawLineVO.setCityProper(decorationOrderPO.getVillagePO().getCityProper().getCityProperName());
			drawLineVO.setHouseNumber(decorationOrderPO.getHouseNumber());
			drawLineVO.setHouseArea(decorationOrderPO.getHouseArea());
			drawLineVO.setContractTime(decorationOrderPO.getContractTime());
			
			drawLineVO.setApplayUser(drawLinePO.getApplayUserPO().getCurrentName());
			drawLineVO.setApplayUserId(drawLinePO.getApplayUserPO().getUserId());
			
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
			SimpleDateFormat dateFormath = new SimpleDateFormat("HH:mm");
			
			if(drawLinePO.getActualStartTime() != null){
				drawLineVO.setActualDate(dateFormat.format(drawLinePO.getActualEndTime()));
				drawLineVO.setEndTime((dateFormath.format(drawLinePO.getActualEndTime())));
				drawLineVO.setStartTime(dateFormath.format(drawLinePO.getActualStartTime()));
			}
			
			if(drawLinePO.getDrawLineUserPO()!=null){
				drawLineVO.setDrawLineUser(drawLinePO.getDrawLineUserPO().getCurrentName());
				drawLineVO.setDrawLineUserId(drawLinePO.getDrawLineUserPO().getUserId());
			}
			
			QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(decorationOrderPO.getOrderId());
			if(quotationPO == null){
				drawLineVO.setDiscount((float) 10);
			}else{
				drawLineVO.setDiscount(quotationPO.getDiscount());
			}
			
			if(decorationOrderPO.getSupervisorPO() != null){
				drawLineVO.setSupervisor(decorationOrderPO.getSupervisorPO().getCurrentName());
			}
			
			drawLineVOs.add(drawLineVO);
		}
		
		return drawLineVOs;
	}

	@Override
	public HashMap<String, HashMap<String,Integer>> countDrawLineByDate(DrawLineVO drawLineVO){
		
		Timestamp startTime = DateUtil.getDateToTimestamp(DateUtil.getFirstDay(DateUtil.parseDate(drawLineVO.getStartTime(), "yyyy-MM-dd HH:mm:ss")));
		Timestamp endTime = DateUtil.getDateToTimestamp(DateUtil.getLastDay(DateUtil.parseDate(drawLineVO.getEndTime(), "yyyy-MM-dd HH:mm:ss")));
		
		HashMap<String, HashMap<String,Integer>> drawLineInfos = new HashMap<String, HashMap<String,Integer>>();
		List<DrawLinePO> drawLinePOs = drawlineDao.queryDrawLine(startTime, endTime);
		
		for(DrawLinePO drawLinePO: drawLinePOs){
			String d = DateUtil.getDateToDateString(drawLinePO.getActualStartTime(), "yyyy-MM-dd");
			
			if(drawLineInfos.get(d) != null){
				HashMap<String,Integer> groupCount = drawLineInfos.get(d);
				if(groupCount.get(drawLinePO.getDrawLineGroup())!=null){
					groupCount.put(drawLinePO.getDrawLineGroup(), groupCount.get(drawLinePO.getDrawLineGroup()).intValue()+1);
				}else{
					groupCount.put(drawLinePO.getDrawLineGroup(), 1);
				}
			}else{
				HashMap<String,Integer> groupCount = new HashMap<String, Integer>();
				groupCount.put(drawLinePO.getDrawLineGroup(), 1);
				drawLineInfos.put(d, groupCount);
			}
		}
		
		return drawLineInfos;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int applayDrawLine(DrawLineVO drawLineVO, String userId) throws FLException{
		
		String orderId = drawLineVO.getOrderId();
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(orderId);
		List<DrawLinePO> drawLinePOs = drawlineDao.queryDrawLineByOrderId(orderId);
		
		DrawLinePO decorationOrderDrawLinePO = null;
		DrawLinePO newDrawLine = new DrawLinePO();
		
		newDrawLine.setApplayCount(0);
		
		if(drawLinePOs != null && drawLinePOs.size() > 0){
			decorationOrderDrawLinePO = drawLinePOs.get(0);
			if(!decorationOrderDrawLinePO.getStatus().equals("放线失败")){
				throw new FLException(120013, "已经在队列中,不可重复提交");
			}
			newDrawLine.setApplayCount(decorationOrderDrawLinePO.getApplayCount()+1);
		}
		
		newDrawLine.setApplayTime(drawLineVO.getApplayTime());
		newDrawLine.setDecorationOrderPO(decorationOrderPO);
		newDrawLine.setApplayUserPO(new UserPO(userId));
		newDrawLine.setStatus("排队");
		newDrawLine.setApplayDes(drawLineVO.getApplayDes());
		
		drawlineDao.saveOrUpdate(newDrawLine);

		decorationOrderPO.setProjectStatus(ChanConstructionSchedulePO.CHAN_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR);
		decorationOrderDao.update(decorationOrderPO);

		String currentTime = DateUtil.current(ChanConstructionSchedulePO.CURRENT_TIME_FORMAT_STR);
		
		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByOrderId(orderId);
		
		if(constructionSchedulePO == null){
			constructionSchedulePO = new ConstructionSchedulePO();
			constructionSchedulePO.setDecorationOrderPO(new DecorationOrderPO(orderId));
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
	public int resetDrawLine(DrawLineVO drawLineVO) throws FLException{
		
		DrawLinePO drawLinePO = drawlineDao.get(drawLineVO.getDlId());
		if(drawLinePO == null){
			throw new FLException(120014, "不存在该放线信息");
		}
		
		Date date = DateUtil.parseDate(drawLineVO.getActualDate() + " " + drawLineVO.getEndTime() , "yyyy-MM-dd HH:mm");
		Timestamp end = DateUtil.getDateToTimestamp(date);
		date = DateUtil.parseDate(drawLineVO.getActualDate() + " " + drawLineVO.getStartTime() , "yyyy-MM-dd HH:mm");
		Timestamp start = DateUtil.getDateToTimestamp(date);
		
		List<DrawLinePO> drawLinePOs = drawlineDao.queryDrawLineByGroupATime(drawLineVO.getDrawLineGroup(), start, end);
		
		if(drawLinePOs != null && drawLinePOs.size() > 0){
			if(!(drawLinePOs.size() == 1 && drawLinePOs.get(0).getDecorationOrderPO().getOrderId().equals(drawLinePO.getDecorationOrderPO().getOrderId()))){
				throw new FLException(120015, "时间重叠不能申请放线计划");
			}
		}

		drawLinePO.setStatus("申请放线");
		drawLinePO.setActualEndTime(end);
		drawLinePO.setActualStartTime(start);
		drawLinePO.setDrawLineGroup(drawLineVO.getDrawLineGroup());
		
		drawlineDao.saveOrUpdate(drawLinePO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateDrawLineForStatus(DrawLineVO drawLineVO, String userId) throws FLException{
		
		DrawLinePO drawLinePO = drawlineDao.get(drawLineVO.getDlId());
		
		MessageVO message = new MessageVO();
		
		if(drawLinePO == null){
			throw new FLException(120016, "不存在该放线信息");
		}
		
		String statusForPO = drawLinePO.getStatus();
		String statusForVO = drawLineVO.getStatus();
		
		if(("分配工人".equals(statusForVO) && "申请放线".equals(statusForPO)) || 
				("放线失败".equals(statusForVO) && "申请放线".equals(statusForPO)) || 
				("排队".equals(statusForVO) && "放线失败".equals(statusForPO)) || 
				("放线成功".equals(statusForVO) && "分配工人".equals(statusForPO)) || 
				("放线失败".equals(statusForVO) && "分配工人".equals(statusForPO))){
			
			drawLinePO.setStatus(statusForVO);
			
			if(statusForVO.equals("放线失败")){
				message.setSender(new UserVO(userId));
				message.setReceiver(new UserVO(drawLinePO.getDecorationOrderPO().getDesignerPO().getUserId()));
				message.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
				message.setType(MessagePO.MESSAGE_TYPE_DELIVER_STR);
				message.setContents(String.format("订单:%s,放线失败!请重新申请放线.", drawLinePO.getDecorationOrderPO().getOrderId()));
				
				messageService.sendMessage(message);
			}
		}else{
			throw new FLException(120017, "订单放线状态错误");
		}

		drawlineDao.saveOrUpdate(drawLinePO);
		
		return 0;
	}
	
}