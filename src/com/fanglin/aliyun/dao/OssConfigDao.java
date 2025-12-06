package com.fanglin.aliyun.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.aliyun.po.OssConfigPO;

public interface OssConfigDao extends Dao<OssConfigPO> {

	public OssConfigPO querySignature(String accessKeyId, String endpoint, String bucket, String dir);
}
