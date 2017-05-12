package com.fanglin.inventory.service.impl;

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
	private CountingService countingService;
	
	@Override
	public void pageAssisOrder(Paging paging, List<Filter> filters) {
		List<AssisOrderPO> assisOrderPOs = assisOrderDao.pageAssisOrder(paging, filters);
		List<AssisOrderVO> assisOrderVOs = new ArrayList<AssisOrderVO>();
		
		AssisOrderVO assisOrderVO;
		
		for(AssisOrderPO assisOrderPO: assisOrderPOs){
			
			assisOrderVO = new AssisOrderVO(new UserVO(),new UserVO());
			
			BeanUtil.copyProperties(assisOrderPO, assisOrderVO, Arrays.asList("creater","approver","manifest"));
			
			assisOrderVO.getCreater().setBaseInfo(assisOrderPO.getCreater());
			assisOrderVO.getApprover().setBaseInfo(assisOrderPO.getApprover());
			
			assisOrderVOs.add(assisOrderVO);
		}

		paging.setData(assisOrderVOs);
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addAssisOrder(AssisOrderVO assisOrderVO,
			List<AssisOrderItemVO> assisOrderItemVOs, String creater,String approver) {
		
		String word = "AO";
		
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_AO_INT, "yyyyMMdd");
		String no = String.valueOf(word) + FormatUtil.fillZero(count, "00000000");
		
		AssisOrderPO assisOrderPO = new AssisOrderPO(no);
		
		UserPO createrPO = userDao.get(creater);
		UserPO approverPO = userDao.get(approver);
		
		BeanUtil.copyProperties(assisOrderVO, assisOrderPO, Arrays.asList("creater","approver","manifest"));
		assisOrderPO.setOrderId(assisOrderVO.getOrderId());
		assisOrderPO.setCreater(createrPO);
		assisOrderPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		assisOrderPO.setApprover(approverPO);
		assisOrderPO.setApproverTime(DateUtil.getDateToTimestamp(new Date()));
		assisOrderPO.setStatus(AssisOrderPO.STATUS_ENABLE_INT);
		assisOrderDao.save(assisOrderPO);
		
		AssisOrderItemPO assisOrderItemPO;
		
		for(AssisOrderItemVO assisOrderItemVO: assisOrderItemVOs){
			assisOrderItemPO = new AssisOrderItemPO(new GoodsPO());
			
			BeanUtil.copyProperties(assisOrderItemVO, assisOrderItemPO,Arrays.asList("goods"));
			BeanUtil.copyProperties(assisOrderItemVO.getGoods(), assisOrderItemPO.getGoods(),Arrays.asList("assisType"));
			
			assisOrderItemPO.setAoid(assisOrderPO.getAoid());
			
			assisOrderItemDao.save(assisOrderItemPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateAssisOrderForStatus(AssisOrderVO assisOrderVO,String userId)
			throws FLException {
		
		UserPO userPO = userDao.get(userId);
		
		AssisOrderPO assisOrderPO = assisOrderDao.get(assisOrderVO.getAoid());
		
		assisOrderPO.setStatus(AssisOrderPO.STATUS_REJECT_INT);
		assisOrderPO.setApprover(userPO);
		assisOrderPO.setApproverTime(DateUtil.getDateToTimestamp(new Date()));
		
		assisOrderDao.update(assisOrderPO);
		
		return 0;
	}

}
