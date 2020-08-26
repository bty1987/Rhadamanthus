package com.fanglin.personel.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.security.AESHelper;
import com.fanglin.personel.dao.UserCompanyDao;
import com.fanglin.personel.po.UserCompanyPO;
import com.fanglin.personel.service.UserCompanyService;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserCompanyVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.vo.CompanyVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.SystemConfig;

@Service("userCompanyService")
@Transactional(readOnly = true)
public class UserCompanyServiceImpl implements UserCompanyService {

	@Autowired
	private UserCompanyDao userCompanyDao;

	@Autowired
	private CompanyDao companyDao;

	@Override
	public List<UserCompanyVO> queryUserCompany(UserBaseVO userVO) throws FLException {

		List<UserCompanyVO> userCompanyVOs = new ArrayList<UserCompanyVO>();
		List<UserCompanyPO> userCompanyPOs = userCompanyDao.queryUserCompany(userVO.getUid());

		UserCompanyVO userCompanyVO;

		for (UserCompanyPO userCompanyPO : userCompanyPOs) {

			userCompanyVO = new UserCompanyVO(new CompanyVO());

			BeanUtil.copyProperties(userCompanyPO, userCompanyVO, Arrays.asList("company"));

			BeanUtil.copyProperties(userCompanyPO.getCompany(), userCompanyVO.getCompany(), Arrays.asList("cid"));

			try {
				userCompanyVO.getCompany().setCid(AESHelper.encrypt(FormatUtil.encodeCompany(userCompanyPO.getCompany().getCid()), SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv")));
			} catch (Exception e) {
				throw new FLException(230015, "公司不存在");
			}

			userCompanyVOs.add(userCompanyVO);

		}

		return userCompanyVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateUserCompany(UserBaseVO userVO, List<String> cids) throws FLException {

		int uid = userVO.getUid();

		userCompanyDao.deleteUserCompany(uid);

		if (cids == null)
			return 0;

		for (String encrypt : cids) {

			Integer cid = null;

			try {
				cid = FormatUtil.decodeCompany(AESHelper.decrypt(encrypt, SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv")));
			} catch (Exception e) {
				throw new FLException(230015, "公司不存在");
			}

			CompanyPO companyPO = companyDao.get(cid);

			if (companyPO == null) {
				throw new FLException(230015, "公司不存在");
			}

			userCompanyDao.save(new UserCompanyPO(uid, companyPO));
		}

		return 0;
	}

	public static void main(String[] args) throws Exception {
		System.out.println(FormatUtil.decodeCompany(AESHelper.decrypt("f3jfJcbxHbdXJs3xJKtDCw==", "844dd1be967b6e9e", "cdb421d038104126")));
		new UserCompanyPO(34, new CompanyPO(0));
	}
}
