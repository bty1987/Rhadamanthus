package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.SupplierSignetDao;
import com.fanglin.data.common.service.SupplierSignetService;
import com.fanglin.data.common.vo.SupplierSignetVO;
import com.fanglin.data.po.SignetPO;
import com.fanglin.data.po.SupplierSignetPO;
import com.fanglin.fadada.signature.SupplierSignature;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("supplierSignetService")
@Transactional(readOnly = true)
public class SupplierSignetServiceImpl implements SupplierSignetService {

	@Autowired
	private SupplierSignetDao supplierSignetDao;

	@Override
	public void pageSupplierSignet(Paging paging, List<Filter> filters, SupplierSignetVO supplierSignetVO, int company) {

		List<SupplierSignetPO> supplierSignetPOs = supplierSignetDao.pageSupplierSignet(paging, filters, company, supplierSignetVO.getSuid());
		List<SupplierSignetVO> supplierSignetVOs = new ArrayList<SupplierSignetVO>();

		for (SupplierSignetPO supplierSignetPO : supplierSignetPOs) {

			supplierSignetVO = new SupplierSignetVO();

			BeanUtil.copyProperties(supplierSignetPO, supplierSignetVO, "company");

			supplierSignetVOs.add(supplierSignetVO);
		}

		paging.setData(supplierSignetVOs);
	}

	@Override
	public List<SupplierSignetVO> querySupplierSignet(SupplierSignetVO supplierSignetVO, int company) {

		List<SupplierSignetPO> supplierSignetPOs = supplierSignetDao.querySupplierSignet(supplierSignetVO.getType(), supplierSignetVO.getSuid(), company);
		List<SupplierSignetVO> supplierSignetVOs = new ArrayList<SupplierSignetVO>();

		for (SupplierSignetPO supplierSignetPO : supplierSignetPOs) {

			supplierSignetVO = new SupplierSignetVO();

			BeanUtil.copyProperties(supplierSignetPO, supplierSignetVO, "company");

			supplierSignetVOs.add(supplierSignetVO);
		}

		return supplierSignetVOs;
	}

	@Override
	public SupplierSignetVO querySupplierSignet(SupplierSignetVO supplierSignetVO) {

		SupplierSignetPO supplierSignetPO = supplierSignetDao.get(supplierSignetVO.getSsid());

		if (supplierSignetPO != null) BeanUtil.copyProperties(supplierSignetPO, supplierSignetVO, "company");

		return supplierSignetVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addSupplierSignet(SupplierSignetVO supplierSignetVO, int company) throws FLException {

		if (supplierSignetDao.countSupplierSignet(supplierSignetVO.getNo()) > 0) {
			throw new FLException(130046, "签章已存在");
		}

		SupplierSignetPO supplierSignetPO = new SupplierSignetPO();

		BeanUtil.copyPropertie(supplierSignetVO, supplierSignetPO, "company");

		supplierSignetPO.setCompany(company);

		supplierSignetDao.save(supplierSignetPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateSupplierSignet(SupplierSignetVO supplierSignetVO) throws FLException {

		SupplierSignetPO supplierSignetPO = supplierSignetDao.get(supplierSignetVO.getSsid());

		if (supplierSignetPO == null) {
			throw new FLException(130045, "签章不存在");
		}

		BeanUtil.copyPropertie(supplierSignetVO, supplierSignetPO, Arrays.asList("status", "company"));

		supplierSignetDao.update(supplierSignetPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int registSupplierSignet(SupplierSignetVO supplierSignetVO) throws FLException {

		SupplierSignetPO supplierSignetPO = supplierSignetDao.get(supplierSignetVO.getSsid());

		if (supplierSignetPO == null) {
			throw new FLException(130045, "签章不存在");
		}

		if (supplierSignetPO.getStatus() != SignetPO.STATUS_INIT_INT) {
			throw new FLException(130047, "签章状态不可操作");
		}

		SupplierSignature.register(supplierSignetPO);

		supplierSignetPO.setStatus(SignetPO.STATUS_REGIST_INT);

		supplierSignetDao.update(supplierSignetPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public String authSupplierSignet(SupplierSignetVO supplierSignetVO) throws FLException {

		SupplierSignetPO supplierSignetPO = supplierSignetDao.get(supplierSignetVO.getSsid());

		if (supplierSignetPO == null) {
			throw new FLException(130045, "签章不存在");
		}

		if (supplierSignetPO.getStatus() != SignetPO.STATUS_REGIST_INT) {
			throw new FLException(130047, "签章状态不可操作");
		}

		String path = SupplierSignature.authenticate(supplierSignetPO);

		supplierSignetPO.setStatus(SignetPO.STATUS_AUTH_INT);

		supplierSignetDao.update(supplierSignetPO);

		supplierSignetVO.setPath(path);

		return path;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int confirmSupplierSignet(SupplierSignetVO supplierSignetVO) throws FLException {

		SupplierSignetPO supplierSignetPO = supplierSignetDao.get(supplierSignetVO.getSsid());

		if (supplierSignetPO == null) {
			throw new FLException(130045, "签章不存在");
		}

		if (supplierSignetPO.getStatus() != SignetPO.STATUS_AUTH_INT) {
			throw new FLException(130047, "签章状态不可操作");
		}

		SupplierSignature.company(supplierSignetPO);

		supplierSignetPO.setStatus(SignetPO.STATUS_CONFIRM_INT);

		supplierSignetDao.update(supplierSignetPO);

		return 0;
	}

	@Override
	public int signateSupplierSignet(SupplierSignetVO supplierSignetVO) throws FLException {

		SupplierSignetPO supplierSignetPO = supplierSignetDao.get(supplierSignetVO.getSsid());

		if (supplierSignetPO == null) {
			throw new FLException(130045, "签章不存在");
		}

		if (supplierSignetPO.getStatus() != SignetPO.STATUS_CONFIRM_INT) {
			throw new FLException(130047, "签章状态不可操作");
		}

		SupplierSignature.signature(supplierSignetPO.getSignno(), supplierSignetVO.getData());

		return 0;
	}

	@Override
	public String autoSupplierSignet(SupplierSignetVO supplierSignetVO) throws FLException {

		SupplierSignetPO supplierSignetPO = supplierSignetDao.get(supplierSignetVO.getSsid());

		if (supplierSignetPO == null) {
			throw new FLException(130045, "签章不存在");
		}

		if (supplierSignetPO.getStatus() != SignetPO.STATUS_CONFIRM_INT) {
			throw new FLException(130047, "签章状态不可操作");
		}

		String path = SupplierSignature.beforeauto(supplierSignetPO);

		supplierSignetVO.setPath(path);

		return path;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int selectSupplierSignet(SupplierSignetVO supplierSignetVO) throws FLException {

		SupplierSignetPO supplierSignetPO = supplierSignetDao.get(supplierSignetVO.getSsid());

		if (supplierSignetPO == null) {
			throw new FLException(130045, "签章不存在");
		}

		if (supplierSignetPO.getStatus() != SignetPO.STATUS_CONFIRM_INT) {
			throw new FLException(130047, "签章状态不可操作");
		}

		supplierSignetPO.setSignid(supplierSignetVO.getSignid());

		supplierSignetDao.update(supplierSignetPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int cancelSupplierSignet(SupplierSignetVO supplierSignetVO) throws FLException {

		SupplierSignetPO supplierSignetPO = supplierSignetDao.get(supplierSignetVO.getSsid());

		if (supplierSignetPO == null) {
			throw new FLException(130045, "签章不存在");
		}

		supplierSignetPO.setStatus(SignetPO.STATUS_CANCEL_INT);

		supplierSignetDao.update(supplierSignetPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int copySupplierSignet(SupplierSignetVO supplierSignetVO) throws FLException {

		SupplierSignetPO supplierSignetPO = supplierSignetDao.get(supplierSignetVO.getSsid());

		if (supplierSignetPO == null) {
			throw new FLException(130045, "签章不存在");
		}

		if (supplierSignetDao.countSupplierSignet(supplierSignetVO.getNo()) > 0) {
			throw new FLException(130046, "签章已存在");
		}

		SupplierSignetPO newSignetPO = new SupplierSignetPO();

		newSignetPO.setNo(supplierSignetVO.getNo());
		newSignetPO.setName(supplierSignetVO.getName());
		newSignetPO.setSuid(supplierSignetVO.getSuid());
		newSignetPO.setKeyword(supplierSignetPO.getKeyword());
		newSignetPO.setType(supplierSignetPO.getType());
		newSignetPO.setPath(supplierSignetPO.getPath());
		newSignetPO.setAuthurl(supplierSignetPO.getAuthurl());
		newSignetPO.setSignno(supplierSignetPO.getSignno());
		newSignetPO.setToken(supplierSignetPO.getToken());
		newSignetPO.setCompany(supplierSignetPO.getCompany());
		newSignetPO.setSignid(supplierSignetPO.getSignid());
		newSignetPO.setStatus(supplierSignetPO.getStatus());

		supplierSignetDao.save(newSignetPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int moveSupplierSignet(SupplierSignetVO supplierSignetVO) throws FLException {

		SupplierSignetPO supplierSignetPO = supplierSignetDao.get(supplierSignetVO.getSsid());

		if (supplierSignetPO == null) {
			throw new FLException(130045, "签章不存在");
		}

		supplierSignetPO.setCompany(CompanyServiceImpl.decode(supplierSignetVO.getCompany()));

		supplierSignetDao.update(supplierSignetPO);

		return 0;
	}
}
