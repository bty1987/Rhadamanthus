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
import com.fanglin.system.po.OrganizationPO;
import com.fanglin.system.service.CompanyService;
import com.fanglin.system.vo.CompanyVO;
import com.fanglin.system.vo.OrganizationVO;
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

			companyVO = new CompanyVO(new OrganizationVO(), new OrganizationVO());

			BeanUtil.copyProperties(companyPO, companyVO, Arrays.asList("cid", "drganization", "srganization"));
			BeanUtil.copyProperties(companyPO.getDrganization(), companyVO.getDrganization());
			BeanUtil.copyProperties(companyPO.getSrganization(), companyVO.getSrganization());

			companyVO.setCid(encode(companyPO.getCid()));

			companyVOs.add(companyVO);
		}

		paging.setData(companyVOs);
	}

	@Override
	public List<CompanyVO> queryCompany(CompanyVO companyVO) throws FLException {

		List<CompanyPO> companyPOs = companyDao.queryCompany(companyVO.getAtttype(), companyVO.getCode());
		List<CompanyVO> companyVOs = new ArrayList<CompanyVO>();

		for (CompanyPO companyPO : companyPOs) {

			companyVO = new CompanyVO();

			BeanUtil.copyProperties(companyPO, companyVO, Arrays.asList("cid", "drganization", "srganization"));

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

		companyVO = new CompanyVO(new OrganizationVO(), new OrganizationVO());

		BeanUtil.copyProperties(companyPO, companyVO, Arrays.asList("cid", "drganization", "srganization"));

		BeanUtil.copyProperties(companyPO.getDrganization(), companyVO.getDrganization());
		BeanUtil.copyProperties(companyPO.getSrganization(), companyVO.getSrganization());

		companyVO.setCid(encode(companyPO.getCid()));

		return companyVO;
	}

	@Override
	public CompanyVO validateCompany(CompanyVO companyVO) throws FLException {

		CompanyPO companyPO = companyDao.get(decode(companyVO.getCid()));

		if (companyPO == null) {
			throw new FLException(110034, "系统正在维护");
		}

		if (companyPO.getStatus() != CompanyPO.STATUS_ENABLE_INT) {
			throw new FLException(110034, "系统正在维护");
		}

		BeanUtil.copyProperties(companyPO, companyVO, Arrays.asList("cid", "drganization", "srganization"));

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

		BeanUtil.copyProperties(companyVO, companyPO, Arrays.asList("drganization", "srganization"));

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

		BeanUtil.copyProperties(companyVO, companyPO, Arrays.asList("drganization", "srganization"));

		if (companyVO.getDrganization() != null) {
			companyPO.setDrganization(new OrganizationPO(companyVO.getDrganization().getOid()));
		}

		if (companyVO.getSrganization() != null) {
			companyPO.setSrganization(new OrganizationPO(companyVO.getSrganization().getOid()));
		}

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
		companyPO.setCode(companyVO.getCode());
		// shortname 不允许更新, 固定空字符串——公司简称参与单号生成(counting), 中文/超长前缀会污染 orderId(历史 11/14 位超长单即源于此)
		companyPO.setShortname("");
		companyPO.setFullname(companyVO.getFullname());
		companyPO.setAddress(companyVO.getAddress());
		companyPO.setCorporation(companyVO.getCorporation());
		companyPO.setPhone(companyVO.getPhone());
		companyPO.setAtttype(companyVO.getAtttype());
		companyPO.setBlock(companyVO.getBlock());

		if (companyVO.getDrganization() != null) {
			companyPO.setDrganization(new OrganizationPO(companyVO.getDrganization().getOid()));
		}

		if (companyVO.getSrganization() != null) {
			companyPO.setSrganization(new OrganizationPO(companyVO.getSrganization().getOid()));
		}

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
