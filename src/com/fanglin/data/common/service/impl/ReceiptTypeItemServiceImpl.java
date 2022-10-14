package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.dao.ReceiptTypeItemDao;
import com.fanglin.data.common.service.ReceiptTypeItemService;
import com.fanglin.data.common.vo.ReceiptTypeItemVO;
import com.fanglin.data.po.ReceiptTypeItemPO;
import com.fanglin.utils.BeanUtil;

@Service("receiptTypeItemService")
@Transactional(readOnly = true)
public class ReceiptTypeItemServiceImpl implements ReceiptTypeItemService {

	@Autowired
	private ReceiptTypeItemDao receiptTypeItemDao;

	@Override
	public List<ReceiptTypeItemVO> queryReceiptTypeItem(ReceiptTypeItemVO receiptTypeItem) {

		List<ReceiptTypeItemPO> receiptTypeItemPOs = receiptTypeItemDao.queryReceiptTypeItem(receiptTypeItem.getRtid());
		List<ReceiptTypeItemVO> receiptTypeItemVOs = new ArrayList<ReceiptTypeItemVO>();

		ReceiptTypeItemVO receiptTypeItemVO = null;

		for (ReceiptTypeItemPO receiptTypeItemPO : receiptTypeItemPOs) {

			receiptTypeItemVO = new ReceiptTypeItemVO();

			BeanUtil.copyProperties(receiptTypeItemPO, receiptTypeItemVO);

			receiptTypeItemVOs.add(receiptTypeItemVO);
		}

		return receiptTypeItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addReceiptTypeItem(ReceiptTypeItemVO receiptTypeItem) throws FLException {

		ReceiptTypeItemPO receiptTypeItemPO = receiptTypeItemDao.queryReceiptTypeItemByBustype(receiptTypeItem.getRtid(), receiptTypeItem.getType(), receiptTypeItem.getPaytype());

		if (receiptTypeItemPO != null) {
			throw new FLException(130038, "单据已存在");
		}

		receiptTypeItemPO = new ReceiptTypeItemPO();

		BeanUtil.copyProperties(receiptTypeItem, receiptTypeItemPO);

		receiptTypeItemDao.save(receiptTypeItemPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteReceiptTypeItem(ReceiptTypeItemVO receiptTypeItem) throws FLException {

		ReceiptTypeItemPO receiptTypeItemPO = receiptTypeItemDao.get(receiptTypeItem.getRtiid());

		receiptTypeItemDao.delete(receiptTypeItemPO);
	}

}
