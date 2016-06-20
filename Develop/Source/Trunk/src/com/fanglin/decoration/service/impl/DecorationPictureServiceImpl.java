/**
 * @File Name		: OrderDesignPictureServiceImpl
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationPictureDao;
import com.fanglin.decoration.po.DecorationPicturePO;
import com.fanglin.decoration.service.DecorationPictureService;
import com.fanglin.decoration.vo.DecorationPictureVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("orderDesignPictureService")
@Transactional(readOnly=true)
public class DecorationPictureServiceImpl implements DecorationPictureService {

	@Autowired
	private DecorationPictureDao orderDesignPictureDao;
	
	@Override
	public List<DecorationPictureVO> queryDecorationPictureByOrderId(DecorationPictureVO decorationPictureVO){
		
		List<DecorationPicturePO> decorationPicturePOs = orderDesignPictureDao.queryDecorationPictureByOrderId(decorationPictureVO.getOrderId());
		List<DecorationPictureVO> decorationPictureVOs = new ArrayList<DecorationPictureVO>();
		
		for(DecorationPicturePO decorationPicturePO: decorationPicturePOs){
			DecorationPictureVO _decorationPictureVO = new DecorationPictureVO();
			
			BeanUtil.copyProperties(decorationPicturePO, _decorationPictureVO);
			
			_decorationPictureVO.setOrderId(decorationPicturePO.getOrderId());
			_decorationPictureVO.setUserId(decorationPicturePO.getUserPO().getUserId());
			
			decorationPictureVOs.add(_decorationPictureVO);
		}
		return decorationPictureVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addDecorationPicture(DecorationPictureVO decorationPictureVO, String userId) throws FLException{
		
		DecorationPicturePO decorationPicturePO = new DecorationPicturePO();

		BeanUtil.copyProperties(decorationPictureVO, decorationPicturePO);
		
		decorationPicturePO.setUserPO(new UserPO(userId));
		decorationPicturePO.setUploadTime(DateUtil.getDateToTimestamp(new Date()));
		
		orderDesignPictureDao.save(decorationPicturePO);
		
		decorationPictureVO.setDpId(decorationPicturePO.getDpId());
		decorationPictureVO.setUploadTime(decorationPicturePO.getUploadTime());
		
		return 0;
	}
	
}
