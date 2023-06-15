package com.fanglin.decoration.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.vo.DecorationPictureVO;

public interface DecorationPictureRecordService {

	public String downloadDecorationPicture(DecorationPictureVO decorationPicture, String userId) throws FLException;

}
