/**
 * @File Name		: AddReduceServiceImpl.java
 * @Package   	: com.fanglin.service.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-22
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.decoration.dao.AddReduceDao;
import com.fanglin.decoration.dao.AddReduceItemDao;
import com.fanglin.decoration.po.AddReducePO;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.decoration.service.AddReduceService;
import com.fanglin.decoration.vo.AddReduceVO;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("addReduceService")
@Transactional(readOnly=true)
public class AddReduceServiceImpl implements AddReduceService{
	
	@Autowired
	private AddReduceDao addReduceDao;
	
	@Autowired
	private AddReduceItemDao addReduceItemDao;
	
	@Autowired
	private DecorationPaymentDao decorationPaymentDao;
	
	@Override
	public void pageAddReduceByOrderId(Paging paging, List<FilterVO> filters, AddReduceVO addReduceVO) {
		
		filters.add(new FilterVO(AddReducePO.COLUMN_ORDERID_STR, addReduceVO.getOrderId(), "eq"));
		
		List<AddReducePO> addReducePOs = addReduceDao.pageAddReduceByOrderId(paging, filters, addReduceVO.getOrderId());
		List<AddReduceVO> addReduceVOs = new ArrayList<AddReduceVO>();
		
		for(AddReducePO addReducePO: addReducePOs){
			
			AddReduceVO _addReduceVO = new AddReduceVO();
			
			BeanUtil.copyProperties(addReducePO, _addReduceVO);
			
			addReduceVOs.add(_addReduceVO);
		}
		
		paging.setData(addReduceVOs);
	}

	@Override
	public List<AddReduceVO> queryAddReduceByOrderId(AddReduceVO addReduceVO){
		
		List<AddReducePO> addReducePOs = addReduceDao.queryAddReduceByOrderId(addReduceVO.getOrderId());
		List<AddReduceVO> addReduceVOs = new ArrayList<AddReduceVO>();
		
		for(AddReducePO addReducePO: addReducePOs){
			
			AddReduceVO _addReduceVO = new AddReduceVO();
			
			BeanUtil.copyProperties(addReducePO, _addReduceVO);
			
			addReduceVOs.add(_addReduceVO);
		}
		
		return addReduceVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addAddReduce(AddReduceVO addReduceVO) {
		
		AddReducePO addReducePO = new AddReducePO();
		
		BeanUtil.copyProperties(addReduceVO, addReducePO, Arrays.asList("arId"));
		
		addReducePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		addReducePO.setStatus(AddReducePO.STATUS_UNSUBMIT_INT);
		addReducePO.setTotal(0f);
		
		addReduceDao.save(addReducePO);
		
		addReduceVO.setArId(addReducePO.getArId());
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateAddReduce(AddReduceVO addReduceVO) throws FLException{
		
		List<Integer> status = Arrays.asList(new Integer[]{AddReducePO.STATUS_PAYED_INT, AddReducePO.STATUS_CONFIRMED_INT});
		
		AddReducePO addReducePO = addReduceDao.get(addReduceVO.getArId());
		
		if(addReducePO == null){
			throw new FLException(140018, "增减项不存在");
		}
		
		if(status.contains(addReducePO.getStatus())){
			throw new FLException(140035, "当前增减项款项状态不可操作");
		}
		
		BeanUtil.copyProperties(addReduceVO, addReducePO);
		
		addReduceDao.saveOrUpdate(addReducePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateAddReduceForAdvance(AddReduceVO addReduceVO) throws FLException {
		
		List<Integer> status = Arrays.asList(new Integer[]{AddReducePO.STATUS_PAYED_INT, AddReducePO.STATUS_CONFIRMED_INT});
		
		AddReducePO addReducePO = addReduceDao.get(addReduceVO.getArId());
		
		if(addReducePO == null){
			throw new FLException(140018, "增减项不存在");
		}
		
		if(status.contains(addReducePO.getStatus())){
			throw new FLException(140035, "当前增减项款项状态不可操作");
		}
		
		addReducePO.setTotal(addReduceVO.getTotal());
		
		addReduceDao.update(addReducePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteAddReduceByArId(AddReduceVO addReduceVO) throws FLException{
		
		List<Integer> status = Arrays.asList(new Integer[]{AddReducePO.STATUS_PAYED_INT, AddReducePO.STATUS_CONFIRMED_INT});
		
		int arId = addReduceVO.getArId();
		
		AddReducePO addReducePO = addReduceDao.get(arId);
		
		if(addReducePO == null){
			throw new FLException(140018, "增减项不存在");
		}
		
		if(status.contains(addReducePO.getStatus())){
			throw new FLException(140035, "当前增减项款项状态不可操作");
		}
		
		if(addReducePO.getDpId() != null){
			decorationPaymentDao.deleteById(addReducePO.getDpId());
		}
		
		addReduceItemDao.deleteAddReductItemByAddReduceId(arId);
		addReduceDao.delete(addReducePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int submitAddReduce(AddReduceVO addReduceVO, String userId) throws FLException{
		
		List<String> paymentStatus = Arrays.asList(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_STR, DecorationPaymentPO.PAYMENTSTATUS_UNSUBMIT_STR);
		List<Integer> status = Arrays.asList(new Integer[]{AddReducePO.STATUS_PAYED_INT, AddReducePO.STATUS_CONFIRMED_INT});
		
		AddReducePO addReducePO = addReduceDao.get(addReduceVO.getArId());
		
		if(addReducePO == null){
			throw new FLException(140018, "增减项不存在");
		}
		
		if(status.contains(addReducePO.getStatus())){
			throw new FLException(140035, "当前增减项款项状态不可操作");
		}
		
		DecorationPaymentPO decorationPaymentPO = null;
		
		if(addReducePO.getDpId() != null){
			decorationPaymentPO = decorationPaymentDao.get(addReducePO.getDpId());
			
			if(decorationPaymentPO != null && !paymentStatus.contains(decorationPaymentPO.getPaymentStatus())){
				throw new FLException(140002, "已付款或已确认,不可修改");
			}
		}else{
			decorationPaymentPO = new DecorationPaymentPO();
		}
		
		decorationPaymentPO.setPaymentStatus("未付款");
		decorationPaymentPO.setReferMoney(addReducePO.getTotal());
		
		decorationPaymentPO.setDecorationOrderPO(new DecorationOrderPO(addReducePO.getOrderId()));
		decorationPaymentPO.setCreateUserPO(new UserPO(userId));
		decorationPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		
		decorationPaymentPO.setPaymentType(addReducePO.getType() == 0 ? DecorationPaymentPO.PAYMENTTYPE_ADD_STR : DecorationPaymentPO.PAYMENTTYPE_REDUCE_STR);
		
		decorationPaymentDao.saveOrUpdate(decorationPaymentPO);
		
		addReducePO.setStatus(1);
		addReducePO.setDpId(decorationPaymentPO.getAutoId());
		addReduceDao.saveOrUpdate(addReducePO);
		
		return 0;
	}
	
	public static void convertAddReduceVOToPOForAdvance(AddReduceVO addReduceVO, AddReducePO addReducePO){
		addReducePO.setTotal(addReduceVO.getTotal());
	}

}