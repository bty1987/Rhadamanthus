package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.PointAccountDao;
import com.fanglin.customer.dao.PointRecordDao;
import com.fanglin.customer.po.PointAccountPO;
import com.fanglin.customer.po.PointRecordPO;
import com.fanglin.customer.service.PointAccountService;
import com.fanglin.customer.vo.PointAccountVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("pointAccountService")
@Transactional(readOnly = true)
public class PointAccountServiceImpl implements PointAccountService {

	@Autowired
	private PointAccountDao pointAccountDao;

	@Autowired
	private PointRecordDao pointRecordDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DecorationDao decorationDao;

	@Override
	public void pagePointAccount(Paging paging, List<Filter> filters) {
		List<PointAccountPO> pointAccountPOs = pointAccountDao.pagePointAccount(paging, filters);

		List<PointAccountVO> pointAccountVOs = new ArrayList<PointAccountVO>();

		if (pointAccountPOs.size() != 0 && pointAccountPOs != null) {

			for (PointAccountPO pointAccountPO : pointAccountPOs) {

				PointAccountVO pointAccountVO = new PointAccountVO(new CustomerVO());

				pointAccountVOs.add(pointAccountPO.ptv(pointAccountVO));
			}
		}

		paging.setData(pointAccountVOs);
	}

	@Override
	public PointAccountVO queryPointAccount(PointAccountVO pointAccountVO) {

		PointAccountPO pointAccountPO = pointAccountDao.queryPointAccount(pointAccountVO.getCustomer().getCid());

		if (pointAccountPO != null) {
			BeanUtil.copyProperties(pointAccountPO, pointAccountVO, "customer");
		}

		return pointAccountVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public PointAccountVO createPointAccount(PointAccountVO pointAccountVO, int company, String userId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(pointAccountVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		PointAccountPO pointAccountPO = pointAccountDao.queryPointAccountByOrderId(pointAccountVO.getOrderId());

		if (pointAccountPO != null) {
			throw new FLException(330048, "积分已存在");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		pointAccountPO = new PointAccountPO();

		BeanUtil.copyProperties(pointAccountVO, pointAccountPO, "customer");

		pointAccountPO.setCustomer(decorationPO.getCustomer());
		pointAccountPO.setCompany(company);

		pointAccountDao.save(pointAccountPO);

		pointRecordDao.save(new PointRecordPO().init(pointAccountPO.getCustomer().getCid(), pointAccountPO.getAccountId(), PointRecordPO.TYPE_ADDUP_INT, PointRecordPO.POINTTYPE_DECORATION_INT, 0, 0, 0, 0, 0, null, decorationPO.getOrderId(), operater));

		return pointAccountVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public PointAccountVO grantPoint(PointAccountVO pointAccountVO, String userId) throws FLException {

		PointAccountPO pointAccountPO = pointAccountDao.queryPointAccountByOrderId(pointAccountVO.getOrderId());

		if (pointAccountPO == null) {
			throw new FLException(330047, "积分不存在");
		}

		Long decorationPoint = pointAccountVO.getDecorationPoint();
		Long materialPoint = pointAccountVO.getMaterialPoint();
		Long operatePoint = pointAccountVO.getOperatePoint();

		UserPO operater = userDao.queryUserByUserId(userId);

		if (decorationPoint != null && decorationPoint != 0) {

			long balance = Arith.add(pointAccountPO.getDecorationPoint(), decorationPoint);

			pointAccountPO.setDecorationPoint(balance);

			pointAccountDao.update(pointAccountPO);
			pointRecordDao.save(new PointRecordPO().init(pointAccountPO.getCustomer().getCid(), pointAccountPO.getAccountId(), PointRecordPO.TYPE_ADDUP_INT, PointRecordPO.POINTTYPE_DECORATION_INT, Arith.add(pointAccountPO.getDecorationPoint(), pointAccountPO.getMaterialPoint()), pointAccountPO.getDecorationPoint(), pointAccountPO.getMaterialPoint(), pointAccountPO.getOperatePoint(), decorationPoint, null, null, operater));
		}

		if (materialPoint != null && materialPoint != 0) {

			long balance = Arith.add(pointAccountPO.getMaterialPoint(), materialPoint);

			pointAccountPO.setMaterialPoint(balance);

			pointAccountDao.update(pointAccountPO);
			pointRecordDao.save(new PointRecordPO().init(pointAccountPO.getCustomer().getCid(), pointAccountPO.getAccountId(), PointRecordPO.TYPE_ADDUP_INT, PointRecordPO.POINTTYPE_SALES_INT, Arith.add(pointAccountPO.getDecorationPoint(), pointAccountPO.getMaterialPoint()), pointAccountPO.getDecorationPoint(), pointAccountPO.getMaterialPoint(), pointAccountPO.getOperatePoint(), materialPoint, null, null, operater));
		}

		if (operatePoint != null && operatePoint != 0) {

			long balance = Arith.add(pointAccountPO.getOperatePoint(), operatePoint);

			pointAccountPO.setOperatePoint(balance);

			pointAccountDao.update(pointAccountPO);
			pointRecordDao.save(new PointRecordPO().init(pointAccountPO.getCustomer().getCid(), pointAccountPO.getAccountId(), PointRecordPO.TYPE_ADDUP_INT, PointRecordPO.POINTTYPE_OPOINT_INT, pointAccountPO.getOperatePoint(), pointAccountPO.getDecorationPoint(), pointAccountPO.getMaterialPoint(), pointAccountPO.getOperatePoint(), operatePoint, null, null, operater));
		}

		return pointAccountVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public PointAccountVO consumePoint(PointAccountVO pointAccountVO, String userId) throws FLException {

		PointAccountPO pointAccountPO = pointAccountDao.queryPointAccountByOrderId(pointAccountVO.getOrderId());

		if (pointAccountPO == null) {
			throw new FLException(330047, "积分不存在");
		}

		Long decorationPoint = pointAccountVO.getDecorationPoint();
		Long materialPoint = pointAccountVO.getMaterialPoint();
		Long operatePoint = pointAccountVO.getOperatePoint();

		UserPO operater = userDao.queryUserByUserId(userId);

		if (decorationPoint != null && decorationPoint != 0) {

			if (pointAccountPO.getDecorationPoint() < decorationPoint) {
				throw new FLException(330049, "积分不足");
			}

			long balance = Arith.sub(pointAccountPO.getDecorationPoint(), decorationPoint);

			pointAccountPO.setDecorationPoint(balance);

			pointAccountDao.update(pointAccountPO);
			pointRecordDao.save(new PointRecordPO().init(pointAccountPO.getCustomer().getCid(), pointAccountPO.getAccountId(), PointRecordPO.TYPE_USERUP_INT, PointRecordPO.POINTTYPE_DECORATION_INT, Arith.add(pointAccountPO.getDecorationPoint(), pointAccountPO.getMaterialPoint()), pointAccountPO.getDecorationPoint(), pointAccountPO.getMaterialPoint(), pointAccountPO.getOperatePoint(), decorationPoint, null, null, operater));
		}

		if (materialPoint != null && materialPoint != 0) {

			if (pointAccountPO.getMaterialPoint() < materialPoint) {
				throw new FLException(330049, "积分不足");
			}

			long balance = Arith.sub(pointAccountPO.getMaterialPoint(), materialPoint);

			pointAccountPO.setMaterialPoint(balance);

			pointAccountDao.update(pointAccountPO);
			pointRecordDao.save(new PointRecordPO().init(pointAccountPO.getCustomer().getCid(), pointAccountPO.getAccountId(), PointRecordPO.TYPE_USERUP_INT, PointRecordPO.POINTTYPE_SALES_INT, Arith.add(pointAccountPO.getDecorationPoint(), pointAccountPO.getMaterialPoint()), pointAccountPO.getDecorationPoint(), pointAccountPO.getMaterialPoint(), pointAccountPO.getOperatePoint(), materialPoint, null, null, operater));
		}

		if (operatePoint != null && operatePoint != 0) {

			long balance = Arith.sub(pointAccountPO.getOperatePoint(), operatePoint);

			pointAccountPO.setOperatePoint(balance);

			pointAccountDao.update(pointAccountPO);
			pointRecordDao.save(new PointRecordPO().init(pointAccountPO.getCustomer().getCid(), pointAccountPO.getAccountId(), PointRecordPO.TYPE_USERUP_INT, PointRecordPO.POINTTYPE_OPOINT_INT, pointAccountPO.getOperatePoint(), pointAccountPO.getDecorationPoint(), pointAccountPO.getMaterialPoint(), pointAccountPO.getOperatePoint(), operatePoint, null, null, operater));
		}

		return pointAccountVO;
	}
}
