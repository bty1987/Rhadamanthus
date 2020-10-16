package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fadada.signature.Signature;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.SignetDao;
import com.fanglin.data.common.service.SignetService;
import com.fanglin.data.common.vo.SignetVO;
import com.fanglin.data.po.SignetPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("signetService")
@Transactional(readOnly = true)
public class SignetServiceImpl implements SignetService {

	@Autowired
	private SignetDao signetDao;

	@Override
	public void pageSignet(Paging paging, List<Filter> filters, int company) {

		List<SignetPO> signetPOs = signetDao.pageSignet(paging, filters, company);
		List<SignetVO> signetVOs = new ArrayList<SignetVO>();

		for (SignetPO signetPO : signetPOs) {
			SignetVO signetVO = new SignetVO();

			BeanUtil.copyProperties(signetPO, signetVO);

			signetVOs.add(signetVO);
		}

		paging.setData(signetVOs);
	}

	@Override
	public List<SignetVO> querySignet(int company) {

		List<SignetPO> signetPOs = signetDao.querySignet(company);
		List<SignetVO> signetVOs = new ArrayList<SignetVO>();

		for (SignetPO signetPO : signetPOs) {
			SignetVO signetVO = new SignetVO();

			BeanUtil.copyProperties(signetPO, signetVO);

			signetVOs.add(signetVO);
		}

		return signetVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addSignet(SignetVO signetVO, int company) throws FLException {

		if (signetDao.countSignet(signetVO.getNo()) > 0) {
			throw new FLException(130046, "签章已存在");
		}

		SignetPO signetPO = new SignetPO();

		BeanUtil.copyPropertie(signetVO, signetPO);

		signetPO.setCompany(company);

		signetDao.save(signetPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateSignet(SignetVO signetVO) throws FLException {

		SignetPO signetPO = signetDao.get(signetVO.getSid());

		if (signetPO == null) {
			throw new FLException(130045, "签章不存在");
		}

		BeanUtil.copyPropertie(signetVO, signetPO, Arrays.asList("status", "company"));

		signetDao.update(signetPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int registSignet(SignetVO signetVO) throws FLException {

		SignetPO signetPO = signetDao.get(signetVO.getSid());

		if (signetPO == null) {
			throw new FLException(130045, "签章不存在");
		}

		if (signetPO.getStatus() != SignetPO.STATUS_INIT_INT) {
			throw new FLException(130047, "签章状态不可操作");
		}

		Signature.register(signetPO);

		signetPO.setStatus(SignetPO.STATUS_REGIST_INT);

		signetDao.update(signetPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public String authSignet(SignetVO signetVO) throws FLException {

		SignetPO signetPO = signetDao.get(signetVO.getSid());

		if (signetPO == null) {
			throw new FLException(130045, "签章不存在");
		}

		if (signetPO.getStatus() != SignetPO.STATUS_REGIST_INT) {
			throw new FLException(130047, "签章状态不可操作");
		}

		String path = Signature.authenticate(signetPO);

		signetVO.setPath(path);

		return path;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int confirmSignet(SignetVO signetVO) throws FLException {

		SignetPO signetPO = signetDao.get(signetVO.getSid());

		if (signetPO == null) {
			throw new FLException(130045, "签章不存在");
		}

		if (signetPO.getStatus() != SignetPO.STATUS_REGIST_INT) {
			throw new FLException(130047, "签章状态不可操作");
		}

		Signature.company(signetPO);

		signetPO.setStatus(SignetPO.STATUS_AUTH_INT);

		signetDao.update(signetPO);

		return 0;
	}

	@Override
	public int signateSignet(SignetVO signetVO) throws FLException {

		SignetPO signetPO = signetDao.get(signetVO.getSid());

		if (signetPO == null) {
			throw new FLException(130045, "签章不存在");
		}

		if (signetPO.getStatus() != SignetPO.STATUS_AUTH_INT) {
			throw new FLException(130047, "签章状态不可操作");
		}

		Signature.signature(signetPO.getSignno(), signetVO.getData());

		return 0;
	}

}
