package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.DecorationPictureDao;
import com.fanglin.customer.service.DecorationPictureService;
import com.fanglin.customer.vo.DecorationPictureVO;
import com.fanglin.decoration.po.DecorationPicturePO;
import com.fanglin.utils.Paging;

@Service("decorationPictureServiceC")
@Transactional(readOnly = true)
public class DecorationPictureServiceImpl implements DecorationPictureService {

	@Autowired
	private DecorationPictureDao decorationPictureDao;

	@Override
	public void queryCusDecorationPicture(Paging paging, List<Filter> filters, String orderId) {

		List<DecorationPicturePO> decorationPicturePOs = decorationPictureDao.queryCusDecorationPicture(paging, filters, orderId);
		List<DecorationPictureVO> decorationPictureVOs = new ArrayList<DecorationPictureVO>();

		if (decorationPicturePOs.size() != 0 && decorationPicturePOs != null) {

			for (DecorationPicturePO decorationPicturePO : decorationPicturePOs) {

				DecorationPictureVO decorationPictureVO = new DecorationPictureVO();

				decorationPictureVO.setName(decorationPicturePO.getName());
				decorationPictureVO.setPath(decorationPicturePO.getPath());
				decorationPictureVO.setType(decorationPicturePO.getType());

				decorationPictureVOs.add(decorationPictureVO);
			}
		}

		paging.setData(decorationPictureVOs);
	}

}
