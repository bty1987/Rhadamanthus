package com.fanglin.customer.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.dao.CppointDao;
import com.fanglin.customer.dao.CppointRecordDao;
import com.fanglin.customer.po.CppointPO;
import com.fanglin.customer.po.CppointRecordPO;
import com.fanglin.customer.service.CppointService;
import com.fanglin.customer.vo.CppointVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;

@Service("cppointService")
@Transactional(readOnly = true)
public class CppointServiceImpl implements CppointService {

	@Autowired
	private CppointDao cppointDao;

	@Autowired
	private CppointRecordDao cppointRecordDao;

	@Autowired
	private UserDao userDao;

	@Override
	public CppointVO queryCppoint(CppointVO cppointVO) {

		CppointPO cppointPO = cppointDao.queryCppoint(cppointVO.getCid());

		if (cppointPO != null) {
			BeanUtil.copyProperties(cppointPO, cppointVO);
		}

		return cppointVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public CppointVO createCppoint(CppointVO cppointVO, int company) throws FLException {

		CppointPO cppointPO = cppointDao.queryCppoint(cppointVO.getCid());

		if (cppointPO != null) {
			throw new FLException(330048, "积分已存在");
		}

		cppointPO = new CppointPO();

		BeanUtil.copyProperties(cppointVO, cppointPO);

		cppointPO.setCompany(company);

		cppointDao.save(cppointPO);

		return cppointVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public CppointVO addupCppoint(CppointVO cppointVO, String userId) throws FLException {

		CppointPO cppointPO = cppointDao.queryCppoint(cppointVO.getCid());

		if (cppointPO == null) {
			throw new FLException(330047, "积分不存在");
		}

		Long dpoint = cppointVO.getDpoint();
		Long spoint = cppointVO.getSpoint();

		UserPO operater = userDao.queryUserByUserId(userId);

		if (dpoint != null && dpoint != 0) {

			long balance = Arith.add(cppointPO.getDpoint(), dpoint);

			cppointPO.setDpoint(balance);

			cppointDao.update(cppointPO);
			cppointRecordDao.save(new CppointRecordPO().init(cppointPO.getCid(), cppointPO.getCpid(), CppointRecordPO.TYPE_ADDUP_INT, CppointRecordPO.POINTTYPE_DECORATION_INT, balance, dpoint, operater));
		}

		if (spoint != null && spoint != 0) {

			long balance = Arith.add(cppointPO.getSpoint(), spoint);

			cppointPO.setSpoint(balance);

			cppointDao.update(cppointPO);
			cppointRecordDao.save(new CppointRecordPO().init(cppointPO.getCid(), cppointPO.getCpid(), CppointRecordPO.TYPE_ADDUP_INT, CppointRecordPO.POINTTYPE_SALES_INT, balance, spoint, operater));
		}

		return cppointVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public CppointVO useupCppoint(CppointVO cppointVO, String userId) throws FLException {

		CppointPO cppointPO = cppointDao.queryCppoint(cppointVO.getCid());

		if (cppointPO == null) {
			throw new FLException(330047, "积分不存在");
		}

		Long dpoint = cppointVO.getDpoint();
		Long spoint = cppointVO.getSpoint();

		UserPO operater = userDao.queryUserByUserId(userId);

		if (dpoint != null && dpoint != 0) {

			if (cppointPO.getDpoint() < dpoint) {
				throw new FLException(330049, "积分不足");
			}

			long balance = Arith.sub(cppointPO.getDpoint(), dpoint);

			cppointPO.setDpoint(balance);

			cppointDao.update(cppointPO);
			cppointRecordDao.save(new CppointRecordPO().init(cppointPO.getCid(), cppointPO.getCpid(), CppointRecordPO.TYPE_USERUP_INT, CppointRecordPO.POINTTYPE_DECORATION_INT, balance, dpoint, operater));
		}

		if (spoint != null && spoint != 0) {

			if (cppointPO.getSpoint() < spoint) {
				throw new FLException(330049, "积分不足");
			}

			long balance = Arith.sub(cppointPO.getSpoint(), spoint);

			cppointPO.setSpoint(balance);

			cppointDao.update(cppointPO);
			cppointRecordDao.save(new CppointRecordPO().init(cppointPO.getCid(), cppointPO.getCpid(), CppointRecordPO.TYPE_USERUP_INT, CppointRecordPO.POINTTYPE_SALES_INT, balance, spoint, operater));
		}

		return cppointVO;
	}

}
