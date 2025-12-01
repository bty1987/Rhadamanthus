package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CppointDao;
import com.fanglin.customer.dao.CppointRecordDao;
import com.fanglin.customer.po.CppointPO;
import com.fanglin.customer.po.CppointRecordPO;
import com.fanglin.customer.service.CppointService;
import com.fanglin.customer.vo.CppointVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("cppointService")
@Transactional(readOnly = true)
public class CppointServiceImpl implements CppointService {

	@Autowired
	private CppointDao cppointDao;

	@Autowired
	private CppointRecordDao cppointRecordDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DecorationDao decorationDao;

	@Override
	public void pageCppoint(Paging paging, List<Filter> filters) {
		List<CppointPO> cppointPOs = cppointDao.pageCppoint(paging, filters);

		List<CppointVO> cppointVOs = new ArrayList<CppointVO>();

		if (cppointPOs.size() != 0 && cppointPOs != null) {

			for (CppointPO cppointPO : cppointPOs) {

				CppointVO cppointVO = new CppointVO(new CustomerVO());

				cppointVOs.add(cppointPO.ptv(cppointVO));
			}
		}

		paging.setData(cppointVOs);
	}

	@Override
	public CppointVO queryCppoint(CppointVO cppointVO) {

		CppointPO cppointPO = cppointDao.queryCppoint(cppointVO.getCustomer().getCid());

		if (cppointPO != null) {
			BeanUtil.copyProperties(cppointPO, cppointVO, "customer");
		}

		return cppointVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public CppointVO createCppoint(CppointVO cppointVO, int company, String userId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(cppointVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		CppointPO cppointPO = cppointDao.queryCppointByOrderId(cppointVO.getOrderId());

		if (cppointPO != null) {
			throw new FLException(330048, "积分已存在");
		}

		UserPO operater = userDao.queryUserByUserId(userId);

		cppointPO = new CppointPO();

		BeanUtil.copyProperties(cppointVO, cppointPO, "customer");

		cppointPO.setCustomer(decorationPO.getCustomer());
		cppointPO.setCompany(company);

		cppointDao.save(cppointPO);

		cppointRecordDao.save(new CppointRecordPO().init(cppointPO.getCustomer().getCid(), cppointPO.getCpid(), CppointRecordPO.TYPE_ADDUP_INT, CppointRecordPO.POINTTYPE_DECORATION_INT, 0, 0, 0, 0, 0, null, decorationPO.getOrderId(), operater));

		return cppointVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public CppointVO addupCppoint(CppointVO cppointVO, String userId) throws FLException {

		CppointPO cppointPO = cppointDao.queryCppointByOrderId(cppointVO.getOrderId());

		if (cppointPO == null) {
			throw new FLException(330047, "积分不存在");
		}

		Long dpoint = cppointVO.getDpoint();
		Long spoint = cppointVO.getSpoint();
		Long opoint = cppointVO.getOpoint();

		UserPO operater = userDao.queryUserByUserId(userId);

		if (dpoint != null && dpoint != 0) {

			long balance = Arith.add(cppointPO.getDpoint(), dpoint);

			cppointPO.setDpoint(balance);

			cppointDao.update(cppointPO);
			cppointRecordDao.save(new CppointRecordPO().init(cppointPO.getCustomer().getCid(), cppointPO.getCpid(), CppointRecordPO.TYPE_ADDUP_INT, CppointRecordPO.POINTTYPE_DECORATION_INT, 0, 0, 0, 0, 0, null, null, operater));
		}

		if (spoint != null && spoint != 0) {

			long balance = Arith.add(cppointPO.getSpoint(), spoint);

			cppointPO.setSpoint(balance);

			cppointDao.update(cppointPO);
			cppointRecordDao.save(new CppointRecordPO().init(cppointPO.getCustomer().getCid(), cppointPO.getCpid(), CppointRecordPO.TYPE_ADDUP_INT, CppointRecordPO.POINTTYPE_DECORATION_INT, 0, 0, 0, 0, 0, null, null, operater));
		}

		if (opoint != null && opoint != 0) {

			long balance = Arith.add(cppointPO.getOpoint(), opoint);

			cppointPO.setOpoint(balance);

			cppointDao.update(cppointPO);
			cppointRecordDao.save(new CppointRecordPO().init(cppointPO.getCustomer().getCid(), cppointPO.getCpid(), CppointRecordPO.TYPE_ADDUP_INT, CppointRecordPO.POINTTYPE_DECORATION_INT, 0, 0, 0, 0, 0, null, null, operater));
		}

		return cppointVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public CppointVO useupCppoint(CppointVO cppointVO, String userId) throws FLException {

		CppointPO cppointPO = cppointDao.queryCppointByOrderId(cppointVO.getOrderId());

		if (cppointPO == null) {
			throw new FLException(330047, "积分不存在");
		}

		Long dpoint = cppointVO.getDpoint();
		Long spoint = cppointVO.getSpoint();
		Long opoint = cppointVO.getOpoint();

		UserPO operater = userDao.queryUserByUserId(userId);

		if (dpoint != null && dpoint != 0) {

			if (cppointPO.getDpoint() < dpoint) {
				throw new FLException(330049, "积分不足");
			}

			long balance = Arith.sub(cppointPO.getDpoint(), dpoint);

			cppointPO.setDpoint(balance);

			cppointDao.update(cppointPO);
			cppointRecordDao.save(new CppointRecordPO().init(cppointPO.getCustomer().getCid(), cppointPO.getCpid(), CppointRecordPO.TYPE_USERUP_INT, CppointRecordPO.POINTTYPE_DECORATION_INT, balance, dpoint, dpoint, spoint, opoint, null, null, operater));
		}

		if (spoint != null && spoint != 0) {

			if (cppointPO.getSpoint() < spoint) {
				throw new FLException(330049, "积分不足");
			}

			long balance = Arith.sub(cppointPO.getSpoint(), spoint);

			cppointPO.setSpoint(balance);

			cppointDao.update(cppointPO);
			cppointRecordDao.save(new CppointRecordPO().init(cppointPO.getCustomer().getCid(), cppointPO.getCpid(), CppointRecordPO.TYPE_USERUP_INT, CppointRecordPO.POINTTYPE_SALES_INT, balance, spoint, dpoint, spoint, opoint, null, null, operater));
		}

		if (opoint != null && opoint != 0) {

			long balance = Arith.sub(cppointPO.getOpoint(), opoint);

			cppointPO.setOpoint(balance);

			cppointDao.update(cppointPO);
			cppointRecordDao.save(new CppointRecordPO().init(cppointPO.getCustomer().getCid(), cppointPO.getCpid(), CppointRecordPO.TYPE_USERUP_INT, CppointRecordPO.POINTTYPE_OPOINT_INT, balance, opoint, dpoint, spoint, opoint, null, null, operater));
		}

		return cppointVO;
	}
}
