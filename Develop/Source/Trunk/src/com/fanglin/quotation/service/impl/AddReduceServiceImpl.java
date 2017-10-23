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

package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.quotation.dao.AddReduceDao;
import com.fanglin.quotation.dao.AddReduceItemDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaItemDao;
import com.fanglin.quotation.po.AddReduceItemPO;
import com.fanglin.quotation.po.AddReducePO;
import com.fanglin.quotation.po.QuotationFunctionAreaItemPO;
import com.fanglin.quotation.service.AddReduceService;
import com.fanglin.quotation.vo.AddReduceVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.utils.Arith;
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
	private QuotationFunctionAreaItemDao quotationFunctionAreaItemDao;
	
	@Autowired
	private DecorationPaymentDao decorationPaymentDao;
	
	@Autowired
	private DecorationOrderDao decorationOrderDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private SystemConfigDao systemConfigDao;
	
	@Override
	public void pageAddReduceByOrderId(Paging paging, List<Filter> filters, AddReduceVO addReduceVO) {
		
		filters.add(new Filter(AddReducePO.COLUMN_ORDERID_STR, addReduceVO.getOrderId(), "eq"));
		
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
	public List<AddReduceVO> queryAddReduceForPayedByOrderId(AddReduceVO addReduceVO) {
		
		List<AddReducePO> addReducePOs = addReduceDao.queryAddReduceForPayedByOrderId(addReduceVO.getOrderId());
		List<AddReduceVO> addReduceVOs = new ArrayList<AddReduceVO>();
		
		for(AddReducePO addReducePO: addReducePOs){
			
			AddReduceVO _addReduceVO = new AddReduceVO();
			
			BeanUtil.copyProperties(addReducePO, _addReduceVO);
			
			addReduceVOs.add(_addReduceVO);
		}
		
		return addReduceVOs;
	}

	@Override
	public AddReduceVO queryAddReduceByDecorationPaymentId(AddReduceVO addReduceVO) throws FLException {
		
		AddReducePO addReducePO = addReduceDao.queryAddReduceByDecorationPaymentId(addReduceVO.getDpId());
		
		if(addReducePO == null){
			throw new FLException(140018, "增减项不存在");
		}
		
		BeanUtil.copyProperties(addReducePO, addReduceVO);
		
		return addReduceVO;
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
		addReducePO.setManagePrice(addReduceVO.getManagePrice());
		
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
		
		List<AddReduceItemPO> addReduceItemPOs = addReduceItemDao.queryAddReduceItemByAddReduceId(arId);
		
		Integer divisor = Integer.parseInt(systemConfigDao.querySystemConfig("quotationFunctionArea").getValue());

		for(AddReduceItemPO addReduceItemPO: addReduceItemPOs){
			
			if(addReduceItemPO.getType() == AddReduceItemPO.TYPE_QUOTATION_ITEM_INT){
				
				QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByQfaiId(QuotationFunctionAreaItemPO.factoryToClazz(addReduceItemPO.getQuotationFunctionArea().getQfaId(), divisor), addReduceItemPO.getQuoteItemId());
				
				if(quotationFunctionAreaItemPO == null){
					throw new FLException(200013, "报价项不存在");
				}
				
				float quotationFunctionAreaItemNum = quotationFunctionAreaItemPO.getNum();
				float addReduceItemNum = addReduceItemPO.getNum();

				quotationFunctionAreaItemPO.setNum(Arith.add(quotationFunctionAreaItemNum, addReduceItemNum));
				quotationFunctionAreaItemDao.update(quotationFunctionAreaItemPO);
			}else if(addReduceItemPO.getType() == AddReduceItemPO.TYPE_ADD_ITEM_INT){
				AddReduceItemPO _addReduceItemPO = addReduceItemDao.get(addReduceItemPO.getQuoteItemId());
				
				if(_addReduceItemPO == null){
					throw new FLException(140036, "增减项目不存在");
				}
				
				float _addReduceItemNum = _addReduceItemPO.getNum();
				float addReduceItemNum = addReduceItemPO.getNum();
				
				_addReduceItemPO.setNum(Arith.add(_addReduceItemNum, addReduceItemNum));
				addReduceItemDao.update(_addReduceItemPO);
			}
			
			addReduceItemDao.delete(addReduceItemPO);
		}
		
		decorationPaymentDao.deleteById(addReducePO.getDpId());
		
		addReduceDao.delete(addReducePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int submitAddReduce(AddReduceVO addReduceVO, String userId) throws FLException{
		
		List<String> paymentStatus = Arrays.asList(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_STR);
		List<Integer> status = Arrays.asList(new Integer[]{AddReducePO.STATUS_PAYED_INT, AddReducePO.STATUS_CONFIRMED_INT});
		
		AddReducePO addReducePO = addReduceDao.get(addReduceVO.getArId());
		
		if(addReducePO == null){
			throw new FLException(140018, "增减项不存在");
		}
		
		if(status.contains(addReducePO.getStatus())){
			throw new FLException(140035, "当前增减项款项状态不可操作");
		}
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(addReducePO.getOrderId());
		
		if(decorationOrderPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		DecorationPaymentPO decorationPaymentPO = null;
		
		if(addReducePO.getDpId() != 0){
			decorationPaymentPO = decorationPaymentDao.get(addReducePO.getDpId());
			
			if(decorationPaymentPO != null && !paymentStatus.contains(decorationPaymentPO.getPaymentStatus())){
				throw new FLException(140002, "已付款或已确认,不可修改");
			}
		}else{
			decorationPaymentPO = new DecorationPaymentPO();
		}
		
		decorationPaymentPO.setPaymentStatus("未付款");
		decorationPaymentPO.setReferMoney((float) Math.rint(addReducePO.getTotal()));
		if(addReducePO.getType() == AddReducePO.TYPE_ADD_INT || addReducePO.getType() == AddReducePO.TYPE_LEAKAGE_INT){
			decorationPaymentPO.setOneType(DecorationPaymentPO.ONETYPE_ADD_INT);
			decorationPaymentPO.setTwoType(DecorationPaymentPO.TWOTYPE_ADD_INT);
		}else{
			decorationPaymentPO.setOneType(DecorationPaymentPO.ONETYPE_REFUND_INT);
			decorationPaymentPO.setTwoType(DecorationPaymentPO.TWOTYPE_REDUCE_INT);
		}
		decorationPaymentPO.setDecorationOrderPO(decorationOrderPO);
		decorationPaymentPO.setCreateUserPO(userDao.queryUserByUserId(userId));
		decorationPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		
		decorationPaymentPO.setPaymentType(addReducePO.getType() == 0 ? DecorationPaymentPO.PAYMENTTYPE_ADD_STR : DecorationPaymentPO.PAYMENTTYPE_REDUCE_STR);
		
		decorationPaymentDao.saveOrUpdate(decorationPaymentPO);
		
		addReducePO.setStatus(1);
		addReducePO.setDpId(decorationPaymentPO.getAutoId());
		addReducePO.setTotal(addReduceVO.getTotal());
		addReducePO.setManagePrice(addReduceVO.getManagePrice());
		
		addReduceDao.update(addReducePO);
		
		return 0;
	}
	
	public static void convertAddReduceVOToPOForAdvance(AddReduceVO addReduceVO, AddReducePO addReducePO){
		addReducePO.setTotal(addReduceVO.getTotal());
	}

}