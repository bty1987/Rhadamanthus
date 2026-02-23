package com.fanglin.decoration.service;

public interface NotificationService {

	/**
	 * 发送钉钉消息
	 *
	 * @param userId 用户ID
	 * @param message 消息内容
	 * @param type 消息类型
	 */
	void sendDingtalk(Long userId, String message, String type);
}
