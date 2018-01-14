/**
 * @File Name		: AddReduceItemServiceImpl.java
 * @Package   	: com.fanglin.decoration.service.impl
 * @Version		: 1.0
 * @Date			: 2016-6-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.po.SystemDefineItemPO;
import com.fanglin.data.quotation.dao.QuotationItemDao;
import com.fanglin.data.quotation.dao.SystemDefineItemDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.quotation.dao.AddReduceDao;
import com.fanglin.quotation.dao.AddReduceItemDao;
import com.fanglin.quotation.dao.ExtensionItemDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaItemDao;
import com.fanglin.quotation.po.AddReduceItemPO;
import com.fanglin.quotation.po.AddReducePO;
import com.fanglin.quotation.po.ExtensionItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.service.AddReduceItemService;
import com.fanglin.quotation.vo.AddReduceItemVO;
import com.fanglin.quotation.vo.AddReduceVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;

@Service("addReduceItemService")
@Transactional(readOnly = true)
public class AddReduceItemServiceImpl implements AddReduceItemService {

	@Autowired
	private AddReduceDao addReduceDao;

	@Autowired
	private AddReduceItemDao addReduceItemDao;

	@Autowired
	private QuotationItemDao quotationItemDao;

	@Autowired
	private SystemDefineItemDao systemDefineItemDao;

	@Autowired
	private QuotationFunctionAreaItemDao quotationFunctionAreaItemDao;

	@Autowired
	private DecorationPaymentDao decorationPaymentDao;

	@Autowired
	private DecorationDao decorationDao;
	
	@Autowired
	private ExtensionItemDao extensionItemDao;
	
	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	public List<AddReduceItemVO> queryAddReduceItemByAddReduceId(AddReduceVO addReduceVO)  throws FLException{

		List<AddReduceItemPO> addReduceItemPOs = addReduceItemDao.queryAddReduceItemByAddReduceId(addReduceVO.getArId());
		List<AddReduceItemVO> addReduceItemVOs = new ArrayList<AddReduceItemVO>();
		Integer divisor = Integer.parseInt(systemConfigDao.querySystemConfig("quotationFunctionArea").getValue());

		for (AddReduceItemPO addReduceItemPO : addReduceItemPOs) {

			AddReduceItemVO addReduceItemVO = new AddReduceItemVO();

			BeanUtil.copyProperties(addReduceItemPO, addReduceItemVO);

			short addReduceItemType = addReduceItemPO.getType();

			if (addReduceItemType == AddReduceItemPO.TYPE_COMMON_QUOTATION_INT) {
				QuotationItemPO quotationItemPO = quotationItemDao.get(addReduceItemPO.getQuoteItemId());

				if (quotationItemPO != null) {
					addReduceItemVO.setContent(quotationItemPO.getQuotationItemDes());
				}
			} else if (addReduceItemType == AddReduceItemPO.TYPE_SYSTEM_QUOTATION_INT) {
				SystemDefineItemPO systemDefineItemPO = systemDefineItemDao.get(addReduceItemPO.getQuoteItemId());

				if (systemDefineItemPO != null) {
					addReduceItemVO.setContent(systemDefineItemPO.getQuotationItemDes());
				}
			} else if (addReduceItemType == AddReduceItemPO.TYPE_QUOTATION_ITEM_INT) {
	
				QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByQfaiId( QuotationFunctionAreaItemPO.factoryToClazz(addReduceItemPO.getQuotationFunctionArea().getQfaId(), divisor),addReduceItemPO.getQuoteItemId());

				if (quotationFunctionAreaItemPO != null) {
					if (quotationFunctionAreaItemPO.getQuotationItem() != null) {
						addReduceItemVO.setContent(quotationFunctionAreaItemPO.getQuotationItem().getQuotationItemDes());
					} else {
						addReduceItemVO.setContent(quotationFunctionAreaItemPO.getContent());
					}
				} else {
					addReduceItemVO.setContent("报价项已被删除");
				}
			}else if(addReduceItemType == AddReduceItemPO.TYPE_EXTENSION_ITEM_INT){
				ExtensionItemPO extensionItemPO = extensionItemDao.get(addReduceItemPO.getQuoteItemId());
				if(extensionItemPO!=null){
					addReduceItemVO.setContent(extensionItemPO.getContent());
				}
			}

			QuotationFunctionAreaPO quotationFunctionAreaPO = addReduceItemPO.getQuotationFunctionArea();
			addReduceItemVO.setQuotationFunctionAreaType(quotationFunctionAreaPO.getType());
			addReduceItemVO.setQuotationFunctionAreaId(quotationFunctionAreaPO.getQfaId());
			addReduceItemVO.setQuotationFunctionAreaName(quotationFunctionAreaPO.getFunctionAreaName());

			addReduceItemVOs.add(addReduceItemVO);
		}

		return addReduceItemVOs;
	}

	@Override
	public List<AddReduceItemVO> queryAddReduceItemByAddReduceIds(List<Integer> addReduceIds) throws FLException{

		List<AddReduceItemVO> addReduceItemVOs = new ArrayList<AddReduceItemVO>();

		if (addReduceIds != null && addReduceIds.size() > 0) {
			List<AddReduceItemPO> addReduceItemPOs = addReduceItemDao.queryAddReduceItemByAddReduceIds(addReduceIds);
			Integer divisor = Integer.parseInt(systemConfigDao.querySystemConfig("quotationFunctionArea").getValue());

			for (AddReduceItemPO addReduceItemPO : addReduceItemPOs) {

				AddReduceItemVO addReduceItemVO = new AddReduceItemVO();

				BeanUtil.copyProperties(addReduceItemPO, addReduceItemVO);

				short addReduceItemType = addReduceItemPO.getType();

				if (addReduceItemType == AddReduceItemPO.TYPE_COMMON_QUOTATION_INT) {
					QuotationItemPO quotationItemPO = quotationItemDao.get(addReduceItemPO.getQuoteItemId());
					if (quotationItemPO != null) {
						addReduceItemVO.setContent(quotationItemPO.getQuotationItemDes());
					}
				} else if (addReduceItemType == AddReduceItemPO.TYPE_SYSTEM_QUOTATION_INT) {
					SystemDefineItemPO systemDefineItemPO = systemDefineItemDao.get(addReduceItemPO.getQuoteItemId());

					if (systemDefineItemPO != null) {
						addReduceItemVO.setContent(systemDefineItemPO.getQuotationItemDes());
					}
				} else if (addReduceItemType == AddReduceItemPO.TYPE_QUOTATION_ITEM_INT) {
					
					QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByQfaiId(QuotationFunctionAreaItemPO.factoryToClazz(addReduceItemPO.getQuotationFunctionArea().getQfaId(), divisor),addReduceItemPO.getQuoteItemId());

					if (quotationFunctionAreaItemPO != null) {
						if (quotationFunctionAreaItemPO.getQuotationItem() != null) {
							addReduceItemVO.setContent(quotationFunctionAreaItemPO.getQuotationItem().getQuotationItemDes());
							
						} else {
							addReduceItemVO.setContent(quotationFunctionAreaItemPO.getContent());
						}
					} else {
						addReduceItemVO.setContent("报价项已被删除");
					}
				}else if(addReduceItemType == AddReduceItemPO.TYPE_EXTENSION_ITEM_INT){
					ExtensionItemPO extensionItemPO = extensionItemDao.get(addReduceItemPO.getQuoteItemId());
					if(extensionItemPO!=null){
						addReduceItemVO.setContent(extensionItemPO.getContent());
					}
				}

				QuotationFunctionAreaPO quotationFunctionAreaPO = addReduceItemPO.getQuotationFunctionArea();
				addReduceItemVO.setQuotationFunctionAreaType(quotationFunctionAreaPO.getType());
				addReduceItemVO.setQuotationFunctionAreaId(quotationFunctionAreaPO.getQfaId());
				addReduceItemVO.setQuotationFunctionAreaName(quotationFunctionAreaPO.getFunctionAreaName());

				addReduceItemVOs.add(addReduceItemVO);
			}
		}

		return addReduceItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateAddReduceItem(AddReduceVO addReduceVO,AddReduceItemVO addReduceItemVO) throws FLException {

		List<Integer> statuses = Arrays.asList(AddReducePO.STATUS_UNSUBMIT_INT,AddReducePO.STATUS_SUBMIT_INT);

		AddReducePO addReducePO = addReduceDao.get(addReduceVO.getArId());

		if (addReducePO == null) {
			throw new FLException(140018, "增减项不存在");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(addReducePO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		if (!statuses.contains(addReducePO.getStatus())) {
			throw new FLException(140035, "当前增减项款项状态不可操作");
		}

		AddReduceServiceImpl.convertAddReduceVOToPOForAdvance(addReduceVO,addReducePO);

		AddReduceItemPO addReduceItemPO = null;
		
		Integer divisor = Integer.parseInt(systemConfigDao.querySystemConfig("quotationFunctionArea").getValue());

		if (addReduceItemVO.getAriId() == null) {

			if (addReduceItemVO.getType() != AddReduceItemPO.TYPE_CUSTOM_QUOTATION_INT&& addReduceItemVO.getQuoteItemId() == null) {
				throw new FLException(140038, "非自定义增减项目需要引用项");
			}

			addReduceItemPO = new AddReduceItemPO();

			BeanUtil.copyProperties(addReduceItemVO, addReduceItemPO);

			addReduceItemPO.setQuotationFunctionArea(new QuotationFunctionAreaPO(addReduceItemVO.getQuotationFunctionAreaId()));
			if (addReduceItemPO.getType() == AddReduceItemPO.TYPE_QUOTATION_ITEM_INT) {
				
				handleQuotationItem(addReduceItemPO.getQuotationFunctionArea().getQfaId(), divisor, addReduceItemPO.getQuoteItemId(), addReduceItemVO.getNum(), 0);
			
			} else if (addReduceItemPO.getType() == AddReduceItemPO.TYPE_ADD_ITEM_INT) {
				
				handleAddReduceItem(addReduceItemPO.getQuoteItemId(), addReduceItemVO.getNum(), 0);
				
			}else  if (addReduceItemPO.getType() == AddReduceItemPO.TYPE_EXTENSION_ITEM_INT){
				
				handleExtensionItem(addReduceItemPO.getQuoteItemId(), addReduceItemVO.getNum(), 0);
				
			}
		} else {
			addReduceItemPO = addReduceItemDao.get(addReduceItemVO.getAriId());

			if (addReduceItemPO == null) {
				throw new FLException(140036, "增减项目不存在");
			}

			if (addReduceItemPO.getType() == AddReduceItemPO.TYPE_QUOTATION_ITEM_INT) {
				
				handleQuotationItem(addReduceItemPO.getQuotationFunctionArea().getQfaId(), divisor,addReduceItemPO.getQuoteItemId(),addReduceItemVO.getNum(),addReduceItemPO.getNum());
				
			} else if (addReduceItemPO.getType() == AddReduceItemPO.TYPE_ADD_ITEM_INT) {
				
				handleAddReduceItem(addReduceItemPO.getQuoteItemId(),addReduceItemVO.getNum(),addReduceItemPO.getNum());
				
			}else if(addReduceItemPO.getType() == AddReduceItemPO.TYPE_EXTENSION_ITEM_INT){
				
				handleExtensionItem(addReduceItemPO.getQuoteItemId(),addReduceItemVO.getNum(),addReduceItemPO.getNum());
				
			}

			addReduceItemPO.setNum(addReduceItemVO.getNum());
		}

		handleDecorationPayment(addReducePO);

		addReduceItemDao.saveOrUpdate(addReduceItemPO);
		addReduceDao.update(addReducePO);

		addReduceItemVO.setAriId(addReduceItemPO.getAriId());
		return 0;

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteAddReduceItem(AddReduceVO addReduceVO,AddReduceItemVO addReduceItemVO) throws FLException {

		List<Integer> statuses = Arrays.asList(AddReducePO.STATUS_UNSUBMIT_INT,AddReducePO.STATUS_SUBMIT_INT);

		AddReducePO addReducePO = addReduceDao.get(addReduceVO.getArId());

		if (addReducePO == null) {
			throw new FLException(140018, "增减项不存在");
		}

		if (!statuses.contains(addReducePO.getStatus())) {
			throw new FLException(140035, "当前增减项款项状态不可操作");
		}

		AddReduceItemPO addReduceItemPO = addReduceItemDao.get(addReduceItemVO.getAriId());

		if (addReduceItemPO == null) {
			throw new FLException(140036, "增减项目不存在");
		}

		if (addReduceItemPO.getType() == AddReduceItemPO.TYPE_QUOTATION_ITEM_INT) {
			
			Integer divisor = Integer.parseInt(systemConfigDao.querySystemConfig("quotationFunctionArea").getValue());
			
			handleQuotationItem(addReduceItemPO.getQuotationFunctionArea().getQfaId(), divisor,addReduceItemPO.getQuoteItemId(), 0, addReduceItemPO.getNum());

		} else if (addReduceItemPO.getType() == AddReduceItemPO.TYPE_ADD_ITEM_INT) {
			
			handleAddReduceItem(addReduceItemPO.getQuoteItemId(),0, addReduceItemPO.getNum());
			
		}else if(addReduceItemPO.getType() == AddReduceItemPO.TYPE_EXTENSION_ITEM_INT){
			
			handleExtensionItem(addReduceItemPO.getQuoteItemId(), 0, addReduceItemPO.getNum());
			
		}

		AddReduceServiceImpl.convertAddReduceVOToPOForAdvance(addReduceVO,addReducePO);
		
		handleDecorationPayment(addReducePO);

		addReduceItemDao.delete(addReduceItemPO);
		addReduceDao.update(addReducePO);

		return 0;
	}
	
	private int handleQuotationItem(long quotationFunctionAreaId, Integer divisor, long quotationItemId, float vonum, float ponum) throws FLException{
		
		QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByQfaiId(QuotationFunctionAreaItemPO.factoryToClazz(quotationFunctionAreaId, divisor),quotationItemId);

		if (quotationFunctionAreaItemPO == null) {
			throw new FLException(200013, "报价项不存在");
		}
		
		float quotationFunctionAreaItemNum = quotationFunctionAreaItemPO.getNum();
		float _diff =  Arith.sub(vonum, ponum);
		
		if (_diff > 0 && quotationFunctionAreaItemNum < _diff) {
			throw new FLException(140039, "减项工程量大于引用项目");
		}

		quotationFunctionAreaItemPO.setNum(Arith.add(quotationFunctionAreaItemNum, ponum- vonum));

		quotationFunctionAreaItemDao.update(quotationFunctionAreaItemPO);
		
		return 0;
	}
	
	private int handleAddReduceItem(long quotationItemId, float vonum, float ponum) throws FLException{
		
		AddReduceItemPO _addReduceItemPO = addReduceItemDao.get(quotationItemId);

		if (_addReduceItemPO == null) {
			throw new FLException(140036, "增减项目不存在");
		}

		float _addReduceItemNum = _addReduceItemPO.getNum();
		float _diff =  Arith.sub(vonum, ponum);

		if (_diff > 0 && _addReduceItemNum < _diff) {
			throw new FLException(140039, "减项工程量大于引用项目");
		}

		_addReduceItemPO.setNum(Arith.add(_addReduceItemNum, ponum - vonum));
		addReduceItemDao.update(_addReduceItemPO);
		
		return 0;
	}
	
	private int handleExtensionItem(long quotationItemId, float vonum, float ponum) throws FLException{
		
		ExtensionItemPO _extensionItemPO = extensionItemDao.get(quotationItemId);
		if (_extensionItemPO == null) {
			throw new FLException(140036, "增减项目不存在");
		}
		float _extensionItemNum = _extensionItemPO.getNum();
		float _diff =  Arith.sub(vonum, ponum);
		
		if (_diff > 0 && _extensionItemNum < _diff) {
			throw new FLException(140039, "减项工程量大于引用项目");
		}
		
		_extensionItemPO.setNum(Arith.add(_extensionItemNum,  ponum - vonum));
		extensionItemDao.update(_extensionItemPO);
		
		return 0;
	}
	
	private int handleDecorationPayment(AddReducePO addReducePO){
		DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(addReducePO.getDpId());

		if (decorationPaymentPO != null) {

			decorationPaymentPO.setReferMoney((float) Math.rint(addReducePO.getTotal()));

			decorationPaymentDao.update(decorationPaymentPO);
		}
		
		return 0;
	}
	
}
