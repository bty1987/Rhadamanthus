/**
 * @File Name		: DecorationMidpackServiceImpl.java
 * @Package   	: com.fanglin.decoration.service.impl
 * @Version		: 1.0
 * @Date			: 2019-11-15
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.service.impl;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationActivityDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.dao.DecorationMidpackDao;
import com.fanglin.decoration.po.DecorationActivityPO;
import com.fanglin.decoration.po.DecorationMidpackPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationMidpackService;
import com.fanglin.decoration.vo.DecorationMidpackVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.payment.service.DecorationPaymentService;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.utils.BeanUtil;

@Service("decorationMidpackService")
@Transactional(readOnly = true)
public class DecorationMidpackServiceImpl implements DecorationMidpackService {

	@Autowired
	private DecorationMidpackDao decorationMidpackDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private DecorationActivityDao decorationActivityDao;
	
	@Autowired
	private DecorationPaymentService decorationPaymentService;

	@Override
	public DecorationMidpackVO queryDecorationMidpack(DecorationMidpackVO decorationMidpackVO) {

		String orderId = decorationMidpackVO.getDecoration().getOrderId();

		DecorationMidpackVO _decorationMidpackVO = new DecorationMidpackVO(new DecorationVO());
		DecorationMidpackPO decorationMidpackPO = decorationMidpackDao.queryDecorationMidpack(orderId);

		if (decorationMidpackPO == null) {
			return _decorationMidpackVO;
		} 

		BeanUtil.copyProperties(decorationMidpackPO, _decorationMidpackVO, Arrays.asList("decoration"));
		_decorationMidpackVO.getDecoration().setEscorter(new UserBaseVO());
		_decorationMidpackVO.getDecoration().setQuoter(new UserBaseVO());

		decorationMidpackPO.getDecoration().ptvcascade(_decorationMidpackVO.getDecoration());

		return _decorationMidpackVO;
	}
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int makeDecorationMidpack(DecorationMidpackVO decorationMidpackVO, String userId) throws FLException {

		String orderId = decorationMidpackVO.getDecoration().getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		List<Short> status = Arrays.asList(new Short[] {DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_PROSIGN_INT, DecorationPO.STATUS_RESIGNED_INT });

		if (!status.contains(decorationPO.getStatus())) {
			throw new FLException(140004, "装修单状态不可操作 ");
		}

		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);

		if (quotationPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		if (quotationPO.getStatus() != QuotationPO.STATUS_LOCK_INT) {
			throw new FLException(200031, "报价未锁定");
		}

		if (decorationActivityDao.countDecorationActivity(orderId, null) == 0) {
			throw new FLException(140033, "订单活动信息不存在");
		}

		if (decorationActivityDao.countDecorationActivity(orderId, DecorationActivityPO.STATUS_INIT_INT) > 0) {
			throw new FLException(140060, "活动未锁定");
		}
		
		// 获取装修单对应的半包信息
		DecorationMidpackPO decorationMidpackPO = decorationMidpackDao.queryDecorationMidpack(orderId);

		if (decorationMidpackPO == null) {
			decorationMidpackPO = new DecorationMidpackPO(decorationPO);
		} 
		
		BeanUtil.copyProperties(decorationMidpackVO, decorationMidpackPO, Arrays.asList("decoration"));
		
		decorationMidpackPO.setDecoration(decorationPO);
		
		decorationMidpackDao.saveOrUpdate(decorationMidpackPO);

		decorationPaymentService.makeDecorationPayment(decorationPO, quotationPO.getTotalPrice(), decorationMidpackVO.getPsId(), userId);
		
		return 0;
	}

}
