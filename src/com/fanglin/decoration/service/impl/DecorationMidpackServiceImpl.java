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

import com.fanglin.common.dao.ServiceRecordDao;
import com.fanglin.common.po.ServiceRecordPO;
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
import com.fanglin.utils.Arith;
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
	private ServiceRecordDao serviceRecordDao;

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

		if (decorationPO.getType() == DecorationPO.TYPE_MIDPACK_INT) {
			decorationPO.setSaleScale(DecorationPO.TYPE_INIT_SALESCALE_INT);
		}

		List<Short> status = Arrays.asList(new Short[] { DecorationPO.STATUS_INIT_INT, DecorationPO.STATUS_DEPOSIT_INT, DecorationPO.STATUS_PROSIGN_INT, DecorationPO.STATUS_RESIGNED_INT });

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

		Long projectPrice = Arith.add(Arith.add(quotationPO.getDisPrice(), quotationPO.getUndisPrice()), quotationPO.getTrafficPrice());

		// 工程基础额 与报价额相同
		Long projectBase = Arith.add(projectPrice, Arith.add(quotationPO.getManagePrice(), quotationPO.getTaxPrice()));

		// 主材总额 = 工程总额 * 主材配比
		Long materialPrice = Arith.mul(Arith.div(Arith.mul(projectBase, decorationMidpackVO.getMaterialRate()), 1000000), 1000000);

		// 服务费 = 服务费 * 服务费比例
		Long servicePrice = Arith.mul(Arith.div(Arith.mul(materialPrice, decorationMidpackVO.getServiceRate()), 1000000), 1000000);

		decorationMidpackPO.setDecoration(decorationPO);
		decorationMidpackPO.setMaterialPrice(materialPrice);
		decorationMidpackPO.setMaterialOrigin(materialPrice);
		decorationMidpackPO.setServicePrice(servicePrice);

		if (decorationMidpackVO.getMaterialRate() == 0) {
			decorationMidpackPO.setMaterialPrice(decorationMidpackVO.getMaterialPrice());
			decorationMidpackPO.setMaterialOrigin(decorationMidpackVO.getMaterialPrice());
		}

		decorationDao.update(decorationPO);

		decorationMidpackDao.saveOrUpdate(decorationMidpackPO);

		decorationPaymentService.makeDecorationPayment(decorationPO, quotationPO.getTotalPrice(), quotationPO.getCostPrice(), decorationMidpackVO.getPsId(), userId);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateDecorationMidpack(DecorationMidpackVO decorationMidpackV0, String userId) throws FLException {

		String orderId = decorationMidpackV0.getDecoration().getOrderId();
		long materialPrice = decorationMidpackV0.getMaterialPrice();

		DecorationMidpackPO decorationMidpackPO = decorationMidpackDao.queryDecorationMidpack(orderId);

		if (decorationMidpackPO == null) {
			throw new FLException(140064, "半包信息不存在");
		}

		decorationMidpackPO.setMaterialPrice(materialPrice);

		decorationMidpackDao.update(decorationMidpackPO);

		serviceRecordDao.save(new ServiceRecordPO().init(ServiceRecordPO.TYPE_CHANGE_DECORATION_INT, userId, orderId, String.format("更新半包信息,装修单:%s,主材配额:%.3f", orderId, Arith.div(materialPrice, 1000.0))));
	}

}
