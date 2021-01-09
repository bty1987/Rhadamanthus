package com.fanglin.system.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.service.CompanyService;
import com.fanglin.system.vo.CompanyVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Service("CompanyService")
@Transactional(readOnly = true)
public class CompanyServiceImpl implements CompanyService {

	@Autowired
	private CompanyDao companyDao;

	@Override
	public void pageCompany(Paging paging, List<Filter> filters) throws FLException {

		List<CompanyPO> companyPOs = companyDao.pageCompany(paging, filters);
		List<CompanyVO> companyVOs = new ArrayList<CompanyVO>();

		CompanyVO companyVO;

		for (CompanyPO companyPO : companyPOs) {

			companyVO = new CompanyVO();

			BeanUtil.copyProperties(companyPO, companyVO, Arrays.asList("cid"));

			companyVO.setCid(encode(companyPO.getCid()));

			companyVOs.add(companyVO);
		}

		paging.setData(companyVOs);
	}

	@Override
	public List<CompanyVO> queryCompany() throws FLException {

		List<CompanyPO> companyPOs = companyDao.queryCompany();
		List<CompanyVO> companyVOs = new ArrayList<CompanyVO>();

		CompanyVO companyVO;

		for (CompanyPO companyPO : companyPOs) {

			companyVO = new CompanyVO();

			BeanUtil.copyProperties(companyPO, companyVO, Arrays.asList("cid"));

			companyVO.setCid(encode(companyPO.getCid()));

			companyVOs.add(companyVO);
		}

		return companyVOs;
	}

	@Override
	public CompanyVO queryCompanyByCid(CompanyVO companyVO) throws FLException {

		CompanyPO companyPO = companyDao.get(decode(companyVO.getCid()));

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		BeanUtil.copyProperties(companyPO, companyVO, Arrays.asList("cid"));

		companyVO.setCid(encode(companyPO.getCid()));

		return companyVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int createCompany(CompanyVO companyVO, String securityCode, String verifyCode) throws FLException {

		try {
			String code = AESHelper.decrypt(securityCode, SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv"));

			if (code == null || !code.equals(verifyCode)) {
				throw new FLException(110001, "验证码错误");
			}
		} catch (Exception e) {
			throw new FLException(110001, "验证码错误");
		}

		CompanyPO companyPO = companyDao.queryCompanyByName(companyVO.getName());

		if (companyPO != null) {
			throw new FLException(230014, "公司已经存在");
		}

		companyPO = new CompanyPO();

		BeanUtil.copyProperties(companyVO, companyPO);

		companyPO.setNo(0);
		companyPO.setShortname("");

		companyDao.save(companyPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addCompany(CompanyVO companyVO) throws FLException {

		CompanyPO companyPO = companyDao.queryCompanyByNo(companyVO.getNo());

		if (companyPO != null) {
			throw new FLException(230016, "公司编号已存在");
		}

		companyPO = companyDao.queryCompanyByName(companyVO.getName());

		if (companyPO != null) {
			throw new FLException(230014, "公司已经存在");
		}

		companyPO = new CompanyPO();

		BeanUtil.copyProperties(companyVO, companyPO);

		companyDao.save(companyPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateCompany(CompanyVO companyVO) throws FLException {

		CompanyPO companyPO = companyDao.get(decode(companyVO.getCid()));

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		companyPO.setName(companyVO.getName());
		companyPO.setFullname(companyVO.getFullname());
		companyPO.setAddress(companyVO.getAddress());
		companyPO.setCorporation(companyVO.getCorporation());
		companyPO.setPhone(companyVO.getPhone());

		companyDao.update(companyPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateCompanyForStatus(CompanyVO companyVO) throws FLException {

		CompanyPO companyPO = companyDao.get(decode(companyVO.getCid()));

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		companyPO.setStatus(companyVO.getStatus());

		companyDao.update(companyPO);

		return 0;
	}

	public static String encode(int company) throws FLException {

		try {
			return AESHelper.encrypt(FormatUtil.encodeCompany(company), SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv"));
		} catch (Exception e) {
			throw new FLException(230017, "公司获取失败");
		}
	}

	public static int decode(String company) throws FLException {

		try {
			return FormatUtil.decodeCompany(AESHelper.decrypt(company, SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv")));
		} catch (Exception e) {
			throw new FLException(230017, "公司获取失败");
		}
	}

}
