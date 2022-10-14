/**
 * @File Name		: CustypeDao.java
 * @Package   	: com.fanglin.communion.service.impl
 * @Version		: 1.0
 * @Date			: 2022-06-14
 * @Copyright	: Copyright Creators 2022
 * @Author		: LY
 */

package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.CustypeDao;
import com.fanglin.communion.po.CustypePO;
import com.fanglin.communion.service.CustypeService;
import com.fanglin.communion.vo.CustypeVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.ReceiptTypeDao;
import com.fanglin.data.common.vo.ReceiptTypeVO;
import com.fanglin.data.po.ReceiptTypePO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("custypeService")
@Transactional(readOnly = true)
public class CustypeServiceImpl implements CustypeService {

	@Autowired
	private CustypeDao custypeDao;

	@Autowired
	private ReceiptTypeDao receiptTypeDao;

	@Override
	public void pageCustype(Paging paging, List<Filter> filters, int company) {

		List<CustypePO> custypePOs = custypeDao.pageCustype(paging, filters, company);
		List<CustypeVO> custypeVOs = new ArrayList<CustypeVO>();

		for (CustypePO custypePO : custypePOs) {
			CustypeVO custypeVO = new CustypeVO(new ReceiptTypeVO());

			BeanUtil.copyProperties(custypePO, custypeVO, Arrays.asList("receiptType"));

			if (custypePO.getReceiptType() != null) {
				BeanUtil.copyProperties(custypePO.getReceiptType(), custypeVO.getReceiptType(), Arrays.asList("receiptTypeItems"));
			}

			custypeVOs.add(custypeVO);
		}

		paging.setData(custypeVOs);

	}

	@Override
	public CustypeVO queryCustype(CustypeVO custype, int company) {

		CustypePO custypePO = custypeDao.queryCustype(company, custype.getDgrade(), custype.getSgrade(), custype.getAtttype());
		CustypeVO custypeVO = new CustypeVO(new ReceiptTypeVO());

		BeanUtil.copyProperties(custypePO, custypeVO, Arrays.asList("receiptType"));

		if (custypePO.getReceiptType() != null) {
			BeanUtil.copyProperties(custypePO.getReceiptType(), custypeVO.getReceiptType(), Arrays.asList("receiptTypeItems"));
		}

		return custypeVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addCustype(CustypeVO custypeVO, int company) throws FLException {

		CustypePO custypePO = new CustypePO();

		if (custypeVO.getReceiptType() != null && custypeVO.getReceiptType().getRtId() != null) {

			ReceiptTypePO receiptTypePO = receiptTypeDao.get(custypeVO.getReceiptType().getRtId());

			if (receiptTypePO == null) {
				throw new FLException(130005, "收据类型不存在");
			}

			custypePO.setReceiptType(receiptTypePO);

		}

		BeanUtil.copyProperties(custypeVO, custypePO, Arrays.asList("receiptType"));
		custypePO.setCompany(company);
		custypePO.setStatus(CustypePO.STATUS_ENABLE_INT);

		custypeDao.save(custypePO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateCustype(CustypeVO custypeVO) throws FLException {

		CustypePO custypePO = custypeDao.get(custypeVO.getCtid());

		if (custypePO == null) {
			throw new FLException(130105, "商户不存在");
		}

		BeanUtil.copyProperties(custypeVO, custypePO, Arrays.asList("receiptType"));

		if (custypeVO.getReceiptType() != null && custypeVO.getReceiptType().getRtId() != null) {

			ReceiptTypePO receiptTypePO = receiptTypeDao.get(custypeVO.getReceiptType().getRtId());

			if (receiptTypePO == null) {
				throw new FLException(130005, "收据类型不存在");
			}

			custypePO.setReceiptType(receiptTypePO);

		}

		custypeDao.update(custypePO);

	}

}
