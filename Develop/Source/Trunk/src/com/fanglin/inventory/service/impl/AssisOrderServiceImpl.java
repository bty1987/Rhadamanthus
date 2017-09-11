package com.fanglin.inventory.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.VillageDao;
import com.fanglin.data.common.vo.VillageVO;
import com.fanglin.data.po.VillagePO;
import com.fanglin.inventory.dao.AssisOrderDao;
import com.fanglin.inventory.dao.AssisOrderItemDao;
import com.fanglin.inventory.po.AssisOrderItemPO;
import com.fanglin.inventory.po.AssisOrderPO;
import com.fanglin.inventory.po.GoodsPO;
import com.fanglin.inventory.service.AssisOrderService;
import com.fanglin.inventory.vo.AssisOrderItemVO;
import com.fanglin.inventory.vo.AssisOrderVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("assisOrderService")
@Transactional(readOnly=true)
public class AssisOrderServiceImpl implements AssisOrderService {
	
	@Autowired
	private AssisOrderDao assisOrderDao;
	
	@Autowired
	private AssisOrderItemDao assisOrderItemDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private VillageDao villageDao;
	
	@Autowired
	private CountingService countingService;
	
	@Override
	public void pageAssisOrder(Paging paging, List<Filter> filters,int company) {
		
		List<AssisOrderPO> assisOrderPOs = assisOrderDao.pageAssisOrder(paging, filters,company);
		List<AssisOrderVO> assisOrderVOs = new ArrayList<AssisOrderVO>();
		
		AssisOrderVO assisOrderVO;
		
		for(AssisOrderPO assisOrderPO: assisOrderPOs){
			
			assisOrderVO = new AssisOrderVO(new VillageVO(),new UserVO(),new UserVO(),new UserVO());
			
			BeanUtil.copyProperties(assisOrderPO, assisOrderVO, Arrays.asList("village","supervisor","creater","approver","fetchTime"));
			
			BeanUtil.copyProperties(assisOrderPO.getVillage(), assisOrderVO.getVillage(), Arrays.asList("cityProper", "buildingNameRule"));
			
			assisOrderVO.getSupervisor().setBaseInfo(assisOrderPO.getSupervisor());
			assisOrderVO.getCreater().setBaseInfo(assisOrderPO.getCreater());
			assisOrderVO.getApprover().setBaseInfo(assisOrderPO.getApprover());
			
//			SimpleDateFormat df = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
			
			Timestamp now = assisOrderPO.getFetchTime();
			if(now != null){
				assisOrderVO.setFetchTime(now.toString());
			}
//			String str = df.format(now);
			
			assisOrderVOs.add(assisOrderVO);
		}

		paging.setData(assisOrderVOs);
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addAssisOrder(AssisOrderVO assisOrderVO,List<AssisOrderItemVO> assisOrderItemVOs, String creater,String approver,int company) {
		
		String word = "AO";
		
		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_AO_INT,currentDate);
		String endNo = FormatUtil.fillZero(FormatUtil.offset(count), "0000");
		
		String no = String.valueOf(word) + currentDate + endNo;
		
		AssisOrderPO assisOrderPO = new AssisOrderPO(no);
		
		VillagePO villagePO = villageDao.get(assisOrderVO.getVillage().getVillageId());
		if(assisOrderVO.getSupervisor()!= null){
			UserPO supervisorPO = userDao.queryUserByUserId(assisOrderVO.getSupervisor().getUserId());
			assisOrderPO.setSupervisor(supervisorPO);
		}
		
		UserPO createrPO = userDao.queryUserByUserId(creater);
		UserPO approverPO = userDao.queryUserByUserId(approver);
		
		BeanUtil.copyProperties(assisOrderVO, assisOrderPO, Arrays.asList("village","supervisor","creater","approver","fetchTime"));
		assisOrderPO.setOrderId(assisOrderVO.getOrderId());
		assisOrderPO.setVillage(villagePO);
		assisOrderPO.setHouseNumber(assisOrderVO.getHouseNumber());
		
		assisOrderPO.setCreater(createrPO);
		assisOrderPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		assisOrderPO.setApprover(approverPO);
		assisOrderPO.setApproverTime(DateUtil.getDateToTimestamp(new Date()));

		Date date = DateUtil.parseDate(assisOrderVO.getFetchTime(), "yyyy-MM-dd");
		Timestamp end = DateUtil.getDateToTimestamp(date);
		assisOrderPO.setFetchTime(end);
		assisOrderPO.setCompany(company);
		assisOrderPO.setStatus(AssisOrderPO.STATUS_ENABLE_INT);
		assisOrderDao.save(assisOrderPO);
		
		AssisOrderItemPO assisOrderItemPO;
		
		for(AssisOrderItemVO assisOrderItemVO: assisOrderItemVOs){
			
			assisOrderItemPO = new AssisOrderItemPO(new GoodsPO());
			
			BeanUtil.copyProperties(assisOrderItemVO, assisOrderItemPO,Arrays.asList("goods","color","format"));
			BeanUtil.copyProperties(assisOrderItemVO.getGoods(), assisOrderItemPO.getGoods(),Arrays.asList("assisType"));
			
			assisOrderItemPO.setAoid(assisOrderPO.getAoid());
			
			assisOrderItemDao.save(assisOrderItemPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateAssisOrderForStatus(AssisOrderVO assisOrderVO,String userId)throws FLException {
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		AssisOrderPO assisOrderPO = assisOrderDao.get(assisOrderVO.getAoid());
		
		if(assisOrderPO == null){
			throw new FLException(260023,"辅料单不存在");
		}
		
		assisOrderPO.setStatus(AssisOrderPO.STATUS_REJECT_INT);
		assisOrderPO.setApprover(userPO);
		assisOrderPO.setApproverTime(DateUtil.getDateToTimestamp(new Date()));
		
		assisOrderDao.update(assisOrderPO);
		
		return 0;
	}

}
