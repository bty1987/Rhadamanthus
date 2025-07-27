package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.dao.QuotationPictureDao;
import com.fanglin.quotation.po.QuotationPicturePO;
import com.fanglin.quotation.service.QuotationPictureService;
import com.fanglin.quotation.vo.QuotationPictureVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("quotationPictureService")
@Transactional(readOnly = true)
public class QuotationPictureServiceImpl implements QuotationPictureService {

	@Autowired
	private QuotationPictureDao quotationPictureDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<QuotationPictureVO> queryQuotationPicture(QuotationPictureVO quotationPictureVO) {

		List<QuotationPicturePO> quotationPicturePOs = quotationPictureDao.queryQuotationPicture(quotationPictureVO.getQid(), quotationPictureVO.getAtttype());
		List<QuotationPictureVO> quotationPictureVOs = new ArrayList<QuotationPictureVO>();

		for (QuotationPicturePO quotationPicturePO : quotationPicturePOs) {
			quotationPictureVOs.add(quotationPicturePO.ptv(new QuotationPictureVO(new UserBaseVO())));
		}

		return quotationPictureVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addQuotationPicture(List<QuotationPictureVO> quotationPictureVOs, String userId) throws FLException {

		QuotationPicturePO quotationPicturePO = new QuotationPicturePO();

		UserPO creater = userDao.queryUserByUserId(userId);

		for (QuotationPictureVO quotationPictureVO : quotationPictureVOs) {

			BeanUtil.copyPropertie(quotationPictureVO, quotationPicturePO, Arrays.asList("creater"));

			quotationPicturePO.setCreater(creater);
			quotationPicturePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			quotationPicturePO.setStatus(QuotationPicturePO.STATUS_YES_SHORT);

			quotationPictureDao.save(quotationPicturePO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteQuotationPicture(QuotationPictureVO quotationPictureVO) {

		QuotationPicturePO quotationPicturePO = quotationPictureDao.get(quotationPictureVO.getQpid());

		quotationPicturePO.setStatus(QuotationPicturePO.STATUS_DEL_SHORT);

		quotationPictureDao.update(quotationPicturePO);

		return 0;
	}

}
