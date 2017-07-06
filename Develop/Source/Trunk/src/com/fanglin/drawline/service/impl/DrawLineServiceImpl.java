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
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.DrawLineGroupDao;
import com.fanglin.data.po.DrawLineGroupPO;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.drawline.dao.DrawLineDao;
import com.fanglin.drawline.po.DrawLinePO;
import com.fanglin.drawline.service.DrawLineService;
import com.fanglin.drawline.vo.DrawLineVO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.information.vo.MessageVO;
import com.fanglin.personel.dao.UserDao;
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
	
	@Autowired
	private DrawLineGroupDao drawLineGroupDao;
	
	@Autowired
	private UserDao userDao;
	
	@Override
	public List<DrawLineVO>  pageDrawLine(Paging paging,List<Filter> filters){
		//通过分页查询   paging分页      filters条件
		List<DrawLinePO> drawLinePOs = drawlineDao.pageDrawLine(paging, filters);
		//建立一个空的集合
		List<DrawLineVO> drawLineVOs = new ArrayList<DrawLineVO>();
		
		for(DrawLinePO drawLinePO: drawLinePOs){
			//建立一个空的对象
			DrawLineVO drawLineVO = new DrawLineVO();
			//将分页查询的数据PO 赋值给VO
			BeanUtil.copyProperties(drawLinePO, drawLineVO);
			//获取装修订单的对象信息
			DecorationOrderPO decorationOrderPO = drawLinePO.getDecorationOrderPO();
			//将订单数据PO里的数据取出 存入放线前台对象VO里
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
			//放线时间(放线日期)不等于null
			if(drawLinePO.getActualStartTime() != null){
				//转化为yyyy-MM-dd格式传入前台(日期格式)
				drawLineVO.setActualDate(dateFormat.format(drawLinePO.getActualEndTime()));
				//转化为HH:mm格式传入前台(时间格式)
				drawLineVO.setEndTime((dateFormath.format(drawLinePO.getActualEndTime())));
				//转化为HH:mm格式传入前台(时间格式)
				drawLineVO.setStartTime(dateFormath.format(drawLinePO.getActualStartTime()));
			}
			
			if(drawLinePO.getDrawLineGroupPO()!=null){
				drawLineVO.setGid(drawLinePO.getDrawLineGroupPO().getGid());
				drawLineVO.setDrawLineGroup(drawLinePO.getDrawLineGroupPO().getName());
			}
			//如果放线人不为null
			if(drawLinePO.getDrawLineUserPO()!=null){
				//现用名 传给VO的放线人
				drawLineVO.setDrawLineUser(drawLinePO.getDrawLineUserPO().getCurrentName());
				//将员工编号传给前台的放线人编号
				drawLineVO.setDrawLineUserId(drawLinePO.getDrawLineUserPO().getUserId());
			}
			//通过订单编号获取默认报价信息
			QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(decorationOrderPO.getOrderId(), decorationOrderPO.getType());
			//如果为null 没有折扣
			if(quotationPO == null){
				//获取折扣
				drawLineVO.setDiscount((float) 10);
			}else{
				//有值 将折扣存入VO
				drawLineVO.setDiscount(quotationPO.getDiscount());
			}
			//如果监理不为null
			if(decorationOrderPO.getSupervisorPO() != null){
				//现用名
				drawLineVO.setSupervisor(decorationOrderPO.getSupervisorPO().getCurrentName());
			}
			//将塞选后的数据存入返回值内
			drawLineVOs.add(drawLineVO);
		}
		//以分页方式返回
		paging.setData(drawLineVOs);
		
		return drawLineVOs;
	}
	
	@Override
	public List<DrawLineVO> queryDrawLine(List<Filter> filters) {
		
		List<DrawLineVO> drawLineVOs = new ArrayList<DrawLineVO>();
		//如果条件为空 就返回
		if(filters.size() == 0) return drawLineVOs;
		//按条件塞选 返回泛型集合
		List<DrawLinePO> drawLinePOs = drawlineDao.queryDrawLine(filters);
		
		for(DrawLinePO drawLinePO: drawLinePOs){
			//创建一个空的对象
			DrawLineVO drawLineVO = new DrawLineVO();
			//将PO的值赋给VO
			BeanUtil.copyProperties(drawLinePO, drawLineVO);
			//获取装修表数据
			DecorationOrderPO decorationOrderPO = drawLinePO.getDecorationOrderPO();
			//将PO中的订单总额赋给VO
			drawLineVO.setOrderTotalPrice(decorationOrderPO.getOrderTotalPrice());
			//将PO中的订单编号赋给VO
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
				//将时间转化为yyyy-MM-dd格式
				drawLineVO.setActualDate(dateFormat.format(drawLinePO.getActualEndTime()));
				//将时间转化为 HH:mm格式
				drawLineVO.setEndTime((dateFormath.format(drawLinePO.getActualEndTime())));
				//将时间转化为  HH:mm格式
				drawLineVO.setStartTime(dateFormath.format(drawLinePO.getActualStartTime()));
			}
			if(drawLinePO.getDrawLineGroupPO()!=null){
				drawLineVO.setGid(drawLinePO.getDrawLineGroupPO().getGid());
				drawLineVO.setDrawLineGroup(drawLinePO.getDrawLineGroupPO().getName());
			}
			//判断是否为null(对应放线人表)
			if(drawLinePO.getDrawLineUserPO()!=null){
				//获取放线人信息
				drawLineVO.setDrawLineUser(drawLinePO.getDrawLineUserPO().getCurrentName());
				//获取放线人ID
				drawLineVO.setDrawLineUserId(drawLinePO.getDrawLineUserPO().getUserId());
			}
			//将订单编号,类型  (0: 半包 , 1: 全包)传入    通过订单编号获取默认报价信息
			QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(decorationOrderPO.getOrderId(), decorationOrderPO.getType());
			//如果等null
			if(quotationPO == null){
				//没有折扣 
				drawLineVO.setDiscount((float) 10);
			}else{
				//如果不为null   就将折扣传入
				drawLineVO.setDiscount(quotationPO.getDiscount());
			}
			//判断监理是否为null
			if(decorationOrderPO.getSupervisorPO() != null){
				//将监理名传入
				drawLineVO.setSupervisor(decorationOrderPO.getSupervisorPO().getCurrentName());
			}
			//将数据存入 带入前台
			drawLineVOs.add(drawLineVO);
		}
		
		return drawLineVOs;
	}

	@Override
	public HashMap<String, HashMap<String,Integer>> countDrawLineByDate(DrawLineVO drawLineVO){
		//mySQL的时间类型转换
		Timestamp startTime = DateUtil.getDateToTimestamp(DateUtil.getFirstDay(DateUtil.parseDate(drawLineVO.getStartTime(), "yyyy-MM-dd HH:mm:ss")));
		Timestamp endTime = DateUtil.getDateToTimestamp(DateUtil.getLastDay(DateUtil.parseDate(drawLineVO.getEndTime(), "yyyy-MM-dd HH:mm:ss")));
		//建立一个以<时间(String类型),<放线小组(String类型),排序(int类型)>>的hashMap集合
		HashMap<String, HashMap<String,Integer>> drawLineInfos = new HashMap<String, HashMap<String,Integer>>();
		//塞选条件不满足的数据 并返回
		List<DrawLinePO> drawLinePOs = drawlineDao.queryDrawLine(startTime, endTime);
		
		for(DrawLinePO drawLinePO: drawLinePOs){
			//按照格式将时间返回成一个String 类型的字符串
			String d = DateUtil.getDateToDateString(drawLinePO.getActualStartTime(), "yyyy-MM-dd");
			//判断返回数据的当天是否已经存入前台需要的集合中
			if(drawLineInfos.get(d) != null){
				//获取在当天的value值(value值为hashMap)
				HashMap<String,Integer> groupCount = drawLineInfos.get(d);
				//判断获取的放线小组是否已经存在 如果存在就将value值+1
				if(groupCount.get(drawLinePO.getDrawLineGroupPO().getName())!=null){
					groupCount.put(drawLinePO.getDrawLineGroupPO().getName(), groupCount.get(drawLinePO.getDrawLineGroupPO().getName()).intValue()+1);
				}else{
					//如果不存在就存入新的放线小组
					groupCount.put(drawLinePO.getDrawLineGroupPO().getName(), 1);
				}
			}else{
				//如果返回的数据在前台集合中没有 就添加
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
		//获取订单ID
		String orderId = drawLineVO.getOrderId();
		//返回一条装修信息
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(orderId);
		//查询订单编号相同的数据 并按照放线信息ID 降序排列
		List<DrawLinePO> drawLinePOs = drawlineDao.queryDrawLineByOrderId(orderId);
		
		DrawLinePO decorationOrderDrawLinePO = null;
		DrawLinePO newDrawLine = new DrawLinePO();
		//申请次数为0
		newDrawLine.setApplayCount(0);
		//如果订单编号不为null
		if(drawLinePOs != null && drawLinePOs.size() > 0){
			//将第一条赋值
			decorationOrderDrawLinePO = drawLinePOs.get(0);
			//如果状态为放线失败
			if(!decorationOrderDrawLinePO.getStatus().equals("放线失败")){
				throw new FLException(120013, "已经在队列中,不可重复提交");
			}
			//将申请次数+1
			newDrawLine.setApplayCount(decorationOrderDrawLinePO.getApplayCount()+1);
		}
		//前台获取的申请放线的时间
		newDrawLine.setApplayTime(drawLineVO.getApplayTime());
		//将按照订单编号查询的装修信息 赋值
		newDrawLine.setDecorationOrderPO(decorationOrderPO);
		//将userID传入
		newDrawLine.setApplayUserPO(userDao.queryUserByUserId(userId));
		//将状态更新为排队
		newDrawLine.setStatus("排队");
		//将前台传入的说明存入
		newDrawLine.setApplayDes(drawLineVO.getApplayDes());
		//更新或存入
		drawlineDao.saveOrUpdate(newDrawLine);
		//更新工程状态为铲大白
		decorationOrderPO.setProjectStatus(ChanConstructionSchedulePO.CHAN_CONSTRUCTION_SCHEDULE_TYPE_NAME_STR);
		//更新状态
		decorationOrderDao.update(decorationOrderPO);
		//获取当前服务器时间(yyyy-MM-dd)
		String currentTime = DateUtil.current(ChanConstructionSchedulePO.CURRENT_TIME_FORMAT_STR);
		//查询一条与前台传入的OrderId相同的数据 并以对象的类型返回 (工程表)
		ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByOrderId(orderId);
		//如果查询的为null
		if(constructionSchedulePO == null){
			//赋予空对象
			constructionSchedulePO = new ConstructionSchedulePO();
			//将订单编号传入
			constructionSchedulePO.setDecorationOrderPO(new DecorationOrderPO(orderId));
			//施工进度为 1:铲大白
			constructionSchedulePO.setSchedule(ConstructionSchedulePO.SCHEDULE_TYPE_CHAN_INT);
			//将订单编号与施工进度存入数据库
			constructionScheduleDao.save(constructionSchedulePO);
		}else{
			//存入施工进度为  1:铲大白
			constructionSchedulePO.setSchedule(ConstructionSchedulePO.SCHEDULE_TYPE_CHAN_INT);
			//更新以存在的订单编号的状态
			constructionScheduleDao.update(constructionSchedulePO);
		}
		//获取工程ID
		long csId = constructionSchedulePO.getCsId();
		//通过订单编号获取铲大白工程信息
		ChanConstructionSchedulePO chanConstructionSchedulePO = chanConstructionScheduleDao.queryChanConstructionScheduleByOrderId(orderId);
		//如果获取到的信息不为null
		if(chanConstructionSchedulePO != null){
			//获取开工标示  0:可编辑
			chanConstructionSchedulePO.setStartTimeFlag(ChanConstructionSchedulePO.STARTTIMEFLAG_TYPE_INIT_INT);
			//获取完工标示  0: 可编辑
			chanConstructionSchedulePO.setEndTimeFlag(ChanConstructionSchedulePO.ENDTIMEFLAG_TYPE_INIT_INT);
			//获取状态    0: 初始 
			chanConstructionSchedulePO.setStatus(ChanConstructionSchedulePO.STATUS_TYPE_INIT_INT);
			//更新铲大白信息
			chanConstructionScheduleDao.update(chanConstructionSchedulePO);
		}else{
			//创建一个新的对象    将工程ID,订单编号,系统当前时间 存入
			chanConstructionSchedulePO = new ChanConstructionSchedulePO(csId, orderId, currentTime, currentTime);
			//将新对象更新或者存入
			chanConstructionScheduleDao.saveOrUpdate(chanConstructionSchedulePO);
		}
		//通过订单编号获取放线表信息
		PutlineConstructionSchedulePO putlineConstructionSchedulePO = putlineConstructionScheduleDao.queryConstructionScheduleByOrderId(orderId);
		//如果不为null
		if(putlineConstructionSchedulePO != null){
			//获取放线表中的状态存入  0: 初始 
			putlineConstructionSchedulePO.setPutlineStatus(PutlineConstructionSchedulePO.PUTLINESTATUS_TYPE_INIT_INT);
			putlineConstructionSchedulePO.setPutlineTime(currentTime);
			//更新放线表
			putlineConstructionScheduleDao.update(putlineConstructionSchedulePO);
		}else{
				//如果为null    将工程ID,修改状态为铲大白的工程表对象,当前时间 存入
				putlineConstructionSchedulePO = new PutlineConstructionSchedulePO(csId, orderId, currentTime, currentTime);
				putlineConstructionSchedulePO.setPutlineTime(currentTime);
				//将放线表存入
				putlineConstructionScheduleDao.save(putlineConstructionSchedulePO);
		}
		//通过订单编号查询水电力表
		WaterwayCircuitPowerConstructionSchedulePO waterwayCircuitPowerConstructionSchedulePO = waterwayCircuitPowerConstructionScheduleDao.queryCircuitPowerConstructionScheduleByOrderId(orderId);
		//如果为null
		if(waterwayCircuitPowerConstructionSchedulePO == null){
			//将  工程ID,订单编号,系统时间 存入
			waterwayCircuitPowerConstructionSchedulePO = new WaterwayCircuitPowerConstructionSchedulePO(csId, orderId, currentTime, currentTime);;
			//存入或更新对象中的数据
			waterwayCircuitPowerConstructionScheduleDao.saveOrUpdate(waterwayCircuitPowerConstructionSchedulePO);
		}
		//通过工程ID查询瓦工表
		BricklayConstructionSchedulePO bricklayConstructionSchedulePO = bricklayConstructionScheduleDao.queryBricklayConstructionScheduleByCsId(csId);
		//如果等于null
		if(bricklayConstructionSchedulePO == null){
			//将  工程ID,订单编号,系统当前时间   存入
			bricklayConstructionSchedulePO = new BricklayConstructionSchedulePO(csId, orderId, currentTime, currentTime);
			//存入数据进数据库
			bricklayConstructionScheduleDao.save(bricklayConstructionSchedulePO);
		}
		//通过工程ID 查询地面找平表
		GroundLevelingConstructionSchedulePO groundLevelingConstructionSchedulePO = groundLevelingConstructionScheduleDao.queryGroundLevelingConstructionScheduleByCsId(csId);
		//如果等于null
		if(groundLevelingConstructionSchedulePO == null){
			//将  工程ID,订单编号,当前系统时间   存入
			groundLevelingConstructionSchedulePO = new GroundLevelingConstructionSchedulePO(csId, orderId, currentTime, currentTime);
			//存入地面找平表的信息
			groundLevelingConstructionScheduleDao.save(groundLevelingConstructionSchedulePO);
		}
		//通过工程ID 查询木工表
		CarpentConstructionSchedulePO carpentConstructionSchedulePO = carpentConstructionScheduleDao.queryCarpentConstructionScheduleByCsId(csId);
		//如果为null
		if(carpentConstructionSchedulePO == null){
			//将    工程ID,订单编号,系统时间   存入
			carpentConstructionSchedulePO = new CarpentConstructionSchedulePO(csId, orderId, currentTime, currentTime);
			//更新或存入木工表信息
			carpentConstructionScheduleDao.saveOrUpdate(carpentConstructionSchedulePO);
		}
		//通过订单编号查询油工表
		OilConstructionSchedulePO oilConstructionSchedulePO = oilConstructionScheduleDao.queryConstructionScheduleByOrderId(orderId);
		//如果为null
		if(oilConstructionSchedulePO == null){
			//将   工程ID,订单编号,系统时间  存入
			oilConstructionSchedulePO = new OilConstructionSchedulePO(csId, orderId, currentTime, currentTime);
			//存入或更新  油工表
			oilConstructionScheduleDao.saveOrUpdate(oilConstructionSchedulePO);
		}
		//通过订单编号查询   水电验收表
		WaterwayCircuitCheckConstructionSchedulePO waterwayCircuitCheckConstructionSchedulePO = waterwayCircuitCheckConstructionScheduleDao.queryWaterwayCircuitCheckConstructionScheduleByOrderId(orderId);
		//如果为null
		if(waterwayCircuitCheckConstructionSchedulePO == null){
			//将  工程ID,订单编号,系统时间 存入
			waterwayCircuitCheckConstructionSchedulePO = new WaterwayCircuitCheckConstructionSchedulePO(csId, orderId, currentTime, currentTime);
			//存入或更新  水电验收表
			waterwayCircuitCheckConstructionScheduleDao.saveOrUpdate(waterwayCircuitCheckConstructionSchedulePO);
		}
		//通过订单编号 获取保洁表
		CleaningConstructionSchedulePO cleaningConstructionSchedulePO = cleaningConstructionScheduleDao.queryCleaningConstructionScheduleByOrderId(orderId);
		//如果为null
		if(cleaningConstructionSchedulePO == null){
			//将  工程ID,订单编号,系统时间   存入
			cleaningConstructionSchedulePO = new CleaningConstructionSchedulePO(csId, orderId, currentTime, currentTime);
			//存入或更新 保洁表
			cleaningConstructionScheduleDao.saveOrUpdate(cleaningConstructionSchedulePO);
		}
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int resetDrawLine(DrawLineVO drawLineVO) throws FLException{
		//按照前台传入主键 获取对象全部信息
		DrawLinePO drawLinePO = drawlineDao.get(drawLineVO.getDlId());
		//如果等于null  则提示
		if(drawLinePO == null){
			throw new FLException(120014, "不存在该放线信息");
		}
		//放线日期+开始放线时间  转化为Date类型
		Date date = DateUtil.parseDate(drawLineVO.getActualDate() + " " + drawLineVO.getEndTime() , "yyyy-MM-dd HH:mm");
		//将时间转化为SQL需要的时间类型
		Timestamp end = DateUtil.getDateToTimestamp(date);
		//放线日期+结束放线时间 转化为Date类型
		date = DateUtil.parseDate(drawLineVO.getActualDate() + " " + drawLineVO.getStartTime() , "yyyy-MM-dd HH:mm");
		//将时间转化为SQL需要的时间类型
		Timestamp start = DateUtil.getDateToTimestamp(date);
		//时间条件判断  
		List<DrawLinePO> drawLinePOs = drawlineDao.queryDrawLineByGroupATime(drawLineVO.getDrawLineGroup(), start, end);
		//如果条件判断返回的结果不为null   
		if(drawLinePOs != null && drawLinePOs.size() > 0){
			
			if(!(drawLinePOs.size() == 1 && drawLinePOs.get(0).getDecorationOrderPO().getOrderId().equals(drawLinePO.getDecorationOrderPO().getOrderId()))){
				throw new FLException(120015, "时间重叠不能申请放线计划");
			}
		}
		DrawLineGroupPO drawLineGroupPO = drawLineGroupDao.get(drawLineVO.getGid());
		if(drawLineGroupPO==null){
			throw new FLException(120014, "不存在该放线信息");
		}
		drawLinePO.setStatus("申请放线");
		drawLinePO.setActualEndTime(end);
		drawLinePO.setActualStartTime(start);
		drawLinePO.setDrawLineGroupPO(drawLineGroupPO);
		drawLinePO.setDrawLineGroup(drawLineGroupPO.getName());
		//调用更新跟存入数据的方法
		drawlineDao.saveOrUpdate(drawLinePO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateDrawLineForStatus(DrawLineVO drawLineVO, String userId) throws FLException{
		//根据主键返回所有数据
		DrawLinePO drawLinePO = drawlineDao.get(drawLineVO.getDlId());
		//信息表
		MessageVO message = new MessageVO();
		//如果返回值为null  就提示
		if(drawLinePO == null){
			throw new FLException(120016, "不存在该放线信息");
		}
		//根据订单ID获取的状态信息
		String statusForPO = drawLinePO.getStatus();
		//前台传入的状态信息
		String statusForVO = drawLineVO.getStatus();
		//根据条件判断  (逻辑判断)
		if(("分配工人".equals(statusForVO) && "申请放线".equals(statusForPO)) || 
				("放线失败".equals(statusForVO) && "申请放线".equals(statusForPO)) || 
				("排队".equals(statusForVO) && "放线失败".equals(statusForPO)) || 
				("放线成功".equals(statusForVO) && "分配工人".equals(statusForPO)) || 
				("放线失败".equals(statusForVO) && "分配工人".equals(statusForPO))){
			//将PO的状态改为前台VO传递过来的参数
			drawLinePO.setStatus(statusForVO);
			//如果前台传递过来的是放线失败
			if(statusForVO.equals("放线失败")){
				//将数据存入信息表中
				//消息ID
				message.setSender(new UserVO(userId));
				//接收人
				message.setReceiver(new UserVO(drawLinePO.getDecorationOrderPO().getDesignerPO().getUserId()));
				//创建时间
				message.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
				//类型 , 包括: 审批消息 , 放线消息 , 个人消息 , 归属消息
				message.setType(MessagePO.MESSAGE_TYPE_DELIVER_STR);
				//消息内容
				message.setContents(String.format("订单:%s,放线失败!请重新申请放线.", drawLinePO.getDecorationOrderPO().getOrderId()));
				//调用发送消息方法 
				messageService.sendMessage(message);
			}
		}else{
			throw new FLException(120017, "订单放线状态错误");
		}
		//将修改状态后的对象传入
		drawlineDao.saveOrUpdate(drawLinePO);
		
		return 0;
	}
	
}