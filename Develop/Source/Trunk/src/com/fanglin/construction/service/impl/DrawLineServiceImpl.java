/**
 * @File Name	: DecorationOrdereServiceImpl.java
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date		: 2014-7-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service.impl;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.dao.DrawLineDao;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.construction.po.DrawLinePO;
import com.fanglin.construction.service.DrawLineService;
import com.fanglin.construction.vo.DrawLineVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.DrawLineGroupDao;
import com.fanglin.data.construction.dao.ConstructionNodeDao;
import com.fanglin.data.po.ConstructionNodeCompanyPO;
import com.fanglin.data.po.DrawLineGroupPO;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("decorationOrderDrawLineService")
@Transactional(readOnly=true)
public class DrawLineServiceImpl implements DrawLineService {

	@Autowired
	private DecorationOrderDao decorationOrderDao;
	
	@Autowired
	private DrawLineDao drawlineDao;
	
	@Autowired
	private QuotationDao quotationDao;
	
	@Autowired
	private MessageService messageService;
	
	@Autowired
	private DrawLineGroupDao drawLineGroupDao;
	
	@Autowired
	private ConstructionDao constructionDao;

	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;
	
	@Autowired
	private ConstructionNodeDao constructionNodeDao;
	
	@Autowired
	private UserDao userDao;
	
	@Override
	public List<DrawLineVO>  pageDrawLine(Paging paging,List<Filter> filters, Integer company){

		List<DrawLinePO> drawLinePOs = drawlineDao.pageDrawLine(paging, filters, company);

		List<DrawLineVO> drawLineVOs = new ArrayList<DrawLineVO>();
		
		for(DrawLinePO drawLinePO: drawLinePOs){

			DrawLineVO drawLineVO = new DrawLineVO();

			BeanUtil.copyProperties(drawLinePO, drawLineVO);

			DecorationOrderPO decorationOrderPO = drawLinePO.getDecorationOrderPO();

			drawLineVO.setOrderTotalPrice(decorationOrderPO.getOrderTotalPrice());
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
			
			if(drawLinePO.getDrawLineGroupPO()!=null){
				
				drawLineVO.setGid(drawLinePO.getDrawLineGroupPO().getGid());
				drawLineVO.setDrawLineGroup(drawLinePO.getDrawLineGroupPO().getName());
				
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
	public List<DrawLineVO> queryDrawLine(List<Filter> filters, Integer company) {
		
		List<DrawLineVO> drawLineVOs = new ArrayList<DrawLineVO>();

		if(filters.size() == 0) return drawLineVOs;

		List<DrawLinePO> drawLinePOs = drawlineDao.queryDrawLine(filters, company);
		
		for(DrawLinePO drawLinePO: drawLinePOs){

			DrawLineVO drawLineVO = new DrawLineVO();

			BeanUtil.copyProperties(drawLinePO, drawLineVO);

			DecorationOrderPO decorationOrderPO = drawLinePO.getDecorationOrderPO();

			drawLineVO.setOrderTotalPrice(decorationOrderPO.getOrderTotalPrice());

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
			
			if(drawLinePO.getDrawLineGroupPO()!=null){
				
				drawLineVO.setGid(drawLinePO.getDrawLineGroupPO().getGid());
				drawLineVO.setDrawLineGroup(drawLinePO.getDrawLineGroupPO().getName());
				
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
	public HashMap<String, HashMap<String,Integer>> countDrawLineByDate(DrawLineVO drawLineVO, Integer company){
		
		Timestamp startTime = DateUtil.getDateToTimestamp(DateUtil.getFirstDay(DateUtil.parseDate(drawLineVO.getStartTime(), "yyyy-MM-dd HH:mm:ss")));
		Timestamp endTime = DateUtil.getDateToTimestamp(DateUtil.getLastDay(DateUtil.parseDate(drawLineVO.getEndTime(), "yyyy-MM-dd HH:mm:ss")));
		
		HashMap<String, HashMap<String,Integer>> drawLineInfos = new HashMap<String, HashMap<String,Integer>>();

		List<DrawLinePO> drawLinePOs = drawlineDao.queryDrawLine(startTime, endTime, company);
		
		for(DrawLinePO drawLinePO: drawLinePOs){

			String d = DateUtil.getDateToDateString(drawLinePO.getActualStartTime(), "yyyy-MM-dd");
			
			if(drawLineInfos.get(d) != null){

				HashMap<String,Integer> groupCount = drawLineInfos.get(d);

				if(groupCount.get(drawLinePO.getDrawLineGroupPO().getName())!=null){
					groupCount.put(drawLinePO.getDrawLineGroupPO().getName(), groupCount.get(drawLinePO.getDrawLineGroupPO().getName()).intValue()+1);
				}else{

					groupCount.put(drawLinePO.getDrawLineGroupPO().getName(), 1);
				}
			}else{

				HashMap<String,Integer> groupCount = new HashMap<String, Integer>();
				groupCount.put(drawLinePO.getDrawLineGroupPO().getName(), 1);
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

		newDrawLine.setApplayUserPO(userDao.queryUserByUserId(userId));

		newDrawLine.setStatus("排队");

		newDrawLine.setApplayDes(drawLineVO.getApplayDes());

		drawlineDao.saveOrUpdate(newDrawLine);

		//设置装修订单的初始进度
		List<ConstructionNodeCompanyPO> constructionNodeCompanyPOs = constructionNodeDao.queryConstructionNodeCompanyByCid(decorationOrderPO.getCompany());
		String nodeName = constructionNodeCompanyPOs.get(0).getConstructionNode().getName();
		decorationOrderPO.setProjectStatus(nodeName);

		decorationOrderDao.update(decorationOrderPO);

		String currentTime = DateUtil.current(ConstructionSchedulePO.CURRENT_TIME_FORMAT_STR);

		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(orderId);
		if(constructionPO == null){
			
			constructionPO = new ConstructionPO();
			constructionPO.setDecorationOrderPO(new DecorationOrderPO(orderId));
			constructionPO.setSchedule((int)constructionNodeCompanyPOs.get(0).getConstructionNode().getCnid());
			constructionDao.save(constructionPO);
			
			long cid = constructionPO.getCid();
			
			for (ConstructionNodeCompanyPO constructionNodeCompanyPO : constructionNodeCompanyPOs) {				
				
				if(constructionNodeCompanyPO.getConstructionNode().getCnid() == 1 || constructionNodeCompanyPO.getConstructionNode().getCnid() == 2){
					
					ConstructionSchedulePO ConstructionSchedulePOO = new ConstructionSchedulePO(cid,orderId,currentTime,currentTime,(short)constructionNodeCompanyPO.getConstructionNode().getCnid());
					constructionScheduleDao.save(ConstructionSchedulePOO);
				
				}else{
					
					ConstructionSchedulePO ConstructionSchedulePOO = new ConstructionSchedulePO(cid,orderId,currentTime,currentTime,(short)constructionNodeCompanyPO.getConstructionNode().getCnid());
					ConstructionSchedulePOO.setStatus((short)1);
					constructionScheduleDao.save(ConstructionSchedulePOO);
					
				}			
			}			
		}
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int resetDrawLine(DrawLineVO drawLineVO, Integer company) throws FLException{
		
		DrawLinePO drawLinePO = drawlineDao.get(drawLineVO.getDlId());

		if(drawLinePO == null){
			throw new FLException(120014, "不存在该放线信息");
		}

		Date date = DateUtil.parseDate(drawLineVO.getActualDate() + " " + drawLineVO.getEndTime() , "yyyy-MM-dd HH:mm");

		Timestamp end = DateUtil.getDateToTimestamp(date);

		date = DateUtil.parseDate(drawLineVO.getActualDate() + " " + drawLineVO.getStartTime() , "yyyy-MM-dd HH:mm");

		Timestamp start = DateUtil.getDateToTimestamp(date);

		List<DrawLinePO> drawLinePOs = drawlineDao.queryDrawLineByGroupATime(drawLineVO.getGid(), start, end, company);
		
		if(drawLinePOs != null && drawLinePOs.size() > 0){
			
			if(!(drawLinePOs.size() == 1 && drawLinePOs.get(0).getDecorationOrderPO().getOrderId().equals(drawLinePO.getDecorationOrderPO().getOrderId()))){
				throw new FLException(120015, "时间重叠不能申请放线计划");
			}
			
		}
		
		DrawLineGroupPO drawLineGroupPO = drawLineGroupDao.get(drawLineVO.getGid());
		
		if(drawLineGroupPO == null){
			throw new FLException(120016, "不存在放线小组");
		}
		
		drawLinePO.setStatus("申请放线");
		drawLinePO.setActualEndTime(end);
		drawLinePO.setActualStartTime(start);
		drawLinePO.setDrawLineGroupPO(drawLineGroupPO);
		drawLinePO.setDrawLineGroup(drawLineGroupPO.getName());

		drawlineDao.saveOrUpdate(drawLinePO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateDrawLineForStatus(DrawLineVO drawLineVO, String userId, Integer company) throws FLException{

		DrawLinePO drawLinePO = drawlineDao.get(drawLineVO.getDlId());

		if(drawLinePO == null){
			throw new FLException(120014, "不存在该放线信息");
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
				messageService.sendMessage(drawLinePO.getDecorationOrderPO().getDesignerPO().getUserId(), userId, (String.format("订单:%s,放线失败!请重新申请放线.", drawLinePO.getDecorationOrderPO().getOrderId())), MessagePO.MESSAGE_TYPE_SEND_CONSTRUCTION_STR, company);
			}
		
		}else{
			
			throw new FLException(120017, "订单放线状态错误");
			
		}
		
		drawlineDao.saveOrUpdate(drawLinePO);
		
		return 0;
	}
	
}